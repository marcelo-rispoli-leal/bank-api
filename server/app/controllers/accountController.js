//imports dependencies
import { db } from '../services/db.js';
import errors from '../libs/errors.js';
import emails from '../libs/mailer.js';
import parsers from '../libs/parsers.js';
import getters from '../libs/getters.js';
import { setUserById } from '../libs/setters.js';

//declares initial constants
const Account = db.accountModel;
const Transaction = db.transactionModel;

//worker creates an account to a user (new customer)
const createOne = async (req, res, next) => {
  try {
    //checks access rights
    errors.workerAccessOnly(req.worker);

    //checks body and load field
    errors.requiredBody(req.body);
    let { CPForCNPJ } = req.body;

    //checks required field
    errors.requiredFields({ CPForCNPJ });

    //checks, formats and loads user or sends error
    CPForCNPJ = parsers.CPForCNPJ(CPForCNPJ);
    const user = await getters.getUser(CPForCNPJ, '_id customer fileName');

    //checks if user already is customer
    errors.userAlreadyIsCustomer(CPForCNPJ, user.customer);

    //checks if the user has sent the documentation file
    !user.fileName && errors.requiredPDF(true);

    //creates account
    const account = await Account.create({
      user: user._id,
      category: CPForCNPJ.length === 14 ? 'PF' : 'PJ',
      customer: CPForCNPJ,
    });

    //sets user as customer
    await setUserById(user._id, { customer: true }, '_id', false);

    //sends email to inform the customer about the created account
    emails.createdAccountMail(account.user.email, account.account);

    //sends new account in response
    res.send(account);
  } catch (err) {
    next(err);
  }
};

//customer creates a transfer between bank accounts
const createTransfer = async (req, res, next) => {
  try {
    //checks access rights
    errors.customerAccessOnly(req.customer);

    //checks body and loads fields
    errors.requiredBody(req.body);
    let { destinyAccount, value } = req.body;

    //checks required fields
    errors.requiredFields({ destinyAccount, value });

    //parses numbers
    value = parsers.moneyNumber(value);
    destinyAccount = parsers.accountNumber(destinyAccount);

    //gets destiny account
    destinyAccount = await getters.getAccountByNumber(destinyAccount, '+_id');

    //gets source account
    const sourceAccount = await getters.getAccountByUser(req.userId, '+_id');

    //checks if source and destiny account are different
    errors.invalidAccounts(sourceAccount._id, destinyAccount._id);

    //checks if balance in source account is enough
    errors.invalidTransaction(sourceAccount.balance, value);

    //prepares transfer
    const now = new Date();
    const data = {
      period: now.toISOString().substr(0, 7),
      createdAt: now,
      value,
    };

    //creates transfer transactions
    await Transaction.bulkWrite([
      {
        insertOne: {
          document: {
            ...data,
            account: sourceAccount._id,
            description: 'TRANSFER DEBIT',
            indicator: 'D',
            previousBalance: sourceAccount.balance,
            currentBalance: sourceAccount.balance - value,
          },
        },
      },
      {
        insertOne: {
          document: {
            ...data,
            account: destinyAccount._id,
            description: 'TRANSFER CREDIT',
            indicator: 'C',
            previousBalance: destinyAccount.balance,
            currentBalance: destinyAccount.balance + value,
          },
        },
      },
    ]);

    //updates accounts balance
    await Account.bulkWrite([
      {
        updateOne: {
          filter: { _id: sourceAccount._id },
          update: { balance: sourceAccount.balance - value },
        },
      },
      {
        updateOne: {
          filter: { _id: destinyAccount._id },
          update: { balance: destinyAccount.balance + value },
        },
      },
    ]);

    //sends data of the transfer made
    res.send({
      sourceAccount: sourceAccount.account,
      sourceCustomerName: sourceAccount.user.name,
      destinyAccount: destinyAccount.account,
      destinyCustomerName: destinyAccount.user.name,
      ...data,
      sourcePreviousBalance: sourceAccount.balance,
      sourceCurrentBalance: sourceAccount.balance - value,
    });
  } catch (err) {
    next(err);
  }
};

//customer creates a debit or credit transaction on his own account
function createTransaction(indicator) {
  return async (req, res, next) => {
    try {
      //checks access rights
      errors.customerAccessOnly(req.customer);

      //checks body and load field
      errors.requiredBody(req.body);
      let { value } = req.body;

      //checks required field
      errors.requiredFields({ value });

      //checks and format value
      value = parsers.moneyNumber(value);

      //gets customer account
      const account = await getters.getAccountByUser(req.userId, '-user');

      //in debit transaction, checks if customer balance is enough
      indicator === 'D' && errors.invalidTransaction(account.balance, value);

      //creates transaction
      const now = new Date();
      const result = await Transaction.create({
        account: account._id,
        period: now.toISOString().substr(0, 7),
        createdAt: now,
        description: `DIRECT ${indicator === 'D' ? 'DEBIT' : 'CREDIT'}`,
        indicator,
        value,
        previousBalance: account.balance,
        currentBalance: value * (indicator === 'D' ? -1 : 1) + account.balance,
      });

      //updates account balance
      account.balance = result.currentBalance;
      account.save();

      //sends transaction created
      res.send(result);
    } catch (err) {
      next(err);
    }
  };
}

//customer or worker gets the current balance of an account
function findOne(isWorker = false) {
  return async (req, res, next) => {
    try {
      //declares initial variable
      let result;

      if (!isWorker) {
        //checks access rights
        errors.customerAccessOnly(req.customer);

        //gets account by user id
        result = await getters.getAccountByUser(req.userId, '+customer -_id');
      } else {
        //checks access rights
        errors.workerAccessOnly(req.worker);

        //checks params, loads and formats account or sends error
        const account = parsers.accountParam(req.params);

        //gets account by number
        result = await getters.getAccountByNumber(account, '-_id');
      }

      //sends account in response
      res.send(result);
    } catch (err) {
      next(err);
    }
  };
}

//customer or worker lists transactions
//for an account in the current or informed period
function findDetails(isWorker = false) {
  return async (req, res, next) => {
    try {
      //declares initial variable
      let account;

      if (!isWorker) {
        //checks access rights
        errors.customerAccessOnly(req.customer);

        //gets account by user if customer
        account = await getters.getAccountByUser(req.userId, '-balance');
      } else {
        //checks access rights
        errors.workerAccessOnly(req.worker);

        //checks body, loads and formats account or sends error
        account = parsers.accountParam(req.params);

        //gets account by number if worker
        account = await getters.getAccountByNumber(account, '-balance');
      }
      console.log(account);
      //loads request query
      const { period } = req.query;

      //if informed, checks period
      period !== undefined && errors.invalidPeriod(period, 'D');

      //gets account transactions
      const result = await getters.getAccountDetails(account, period);

      //sends account transactions founded
      res.send(result);
    } catch (err) {
      next(err);
    }
  };
}

//customer or worker gets the summary (daily, monthly or yearly)
//of an account's transactions in the current or informed period
function findSummary(type, isWorker = false) {
  return async (req, res, next) => {
    try {
      //declares initial variable
      let account;

      if (!isWorker) {
        //checks access rights
        errors.customerAccessOnly(req.customer);

        //gets account by user if customer access
        account = await getters.getAccountByUser(req.userId, '-balance');
      } else {
        //checks access rights
        errors.workerAccessOnly(req.worker);

        //checks body, loads and formats account or sends error
        account = parsers.accountParam(req.params);

        //gets account by number if worker access
        account = await getters.getAccountByNumber(account, '-balance');
      }

      //loads another query field
      const { period } = req.query;

      //if informed, checks period
      period !== undefined && errors.invalidPeriod(period, type);

      //gets account transactions summary
      const result = await getters.getAccountSummary(account, type, period);

      //sends summary in response
      res.send(result);
    } catch (err) {
      next(err);
    }
  };
}

//worker lists the current balance of each account in a category, if informed
function findAll(category) {
  return async (req, res, next) => {
    try {
      //checks access rights
      errors.workerAccessOnly(req.worker);

      //gets accounts or sends error if not found
      const result = await getters.getAccounts(category);

      //sends list in response of request
      res.send(result);
    } catch (err) {
      next(err);
    }
  };
}

//worker gets the current total balance of an account category, if informed
function findTotalAccounts(category) {
  return async (req, res, next) => {
    try {
      //checks access rights
      errors.workerAccessOnly(req.worker);

      //gets accounts or send error if not found
      const result = await getters.getTotalAccounts(category);

      //sends current total balance in response
      res.send(result);
    } catch (err) {
      next(err);
    }
  };
}

//worker gets the total (daily, monthly or yearly) of transactions
//in an account category, if informed, in the current period or provided
function findTotalTransactions(type, category) {
  return async (req, res, next) => {
    try {
      //checks access rights
      errors.workerAccessOnly(req.worker);

      //loads query field
      const { period } = req.query;

      //if informed, checks period
      period !== undefined && errors.invalidPeriod(period, type);

      //gets accounts or send error if not found
      const result = await getters.getTotalTransactions(type, period, category);

      //sends totalized transactions in response
      res.send(result);
    } catch (err) {
      next(err);
    }
  };
}

//exports the methods for your import into account routes
export default {
  createOne,
  createTransfer,
  createTransaction,
  findOne,
  findDetails,
  findSummary,
  findAll,
  findTotalAccounts,
  findTotalTransactions,
};
