import { db } from '../services/db.js';
import errors from './errors.js';

const User = db.userModel;
const Account = db.accountModel;
const Transaction = db.transactionModel;

async function getUser(CPForCNPJ, select = null, errorNotFound = true) {
  const result =
    select === null
      ? await User.findOne({ CPForCNPJ }, '_id')
      : await User.findOne({ CPForCNPJ }, `${select}`);

  if (!result && errorNotFound === true) {
    errors.userNotFound(CPForCNPJ);
  } else if (result && errorNotFound === false) {
    errors.userAlreadyExists(CPForCNPJ);
  }

  return result;
}

async function getUsers(category = 'all', nameFilter = '') {
  let condition =
    category === 'all'
      ? {}
      : category === 'unchecked'
      ? { customer: false, filePath: !undefined }
      : category === 'PJ'
      ? { CPForCNPJ: /^\d{2}\./ }
      : category === 'PF'
      ? { CPForCNPJ: /^\d{3}\./, worker: false }
      : { CPForCNPJ: /^\d{3}\./, worker: true };

  if (!nameFilter.trim() !== '') {
    condition = {
      ...condition,
      name: { $regex: new RegExp(nameFilter.trim()), $options: 'i' },
    };
  }

  const result = await User.find(condition);

  if (result.length === 0) {
    errors.usersNotFound(category, nameFilter.trim());
  }

  return result;
}

async function getAccountByNumber(account, select = null) {
  const result =
    select === null
      ? await Account.findOne({ account }, '_id')
      : await Account.findOne({ account }, `${select}`);

  !result && errors.accountNotFound(account);

  return result;
}

async function getAccountByUser(user, select = null) {
  const result =
    select === null
      ? await Account.findOne({ user }, '_id')
      : await Account.findOne({ user }, `${select}`);

  !result && errors.accountNotFound(account);

  return result;
}

async function getAccountDetails(objAccount, period = undefined) {
  console.log(objAccount);
  const { account, _id } = objAccount;

  period = period || new Date().toISOString().substr(0, 7);

  let result = await Transaction.find({ account: _id, period });

  if (result.length === 0) {
    errors.transactionsNotFound(account, period);
  }

  return result;
}

async function getAccountSummary(objAccount, type = 'D', period = undefined) {
  const { account, _id } = objAccount;
  let match = { account: _id };

  if (type === 'D') {
    period = period || new Date().toISOString().substr(0, 7);
    match = { ...match, period };
  } else {
    period = period || new Date().toISOString().substr(0, 4);
    match = {
      ...match,
      period: { $gte: `${period}-01`, $lte: `${period}-12` },
    };
  }

  const format = type === 'D' ? '%Y-%m-%d' : type === 'M' ? '%Y-%m' : '%Y';
  const addFields =
    type === 'D'
      ? { date: '$_id' }
      : type === 'M'
      ? { period: '$_id' }
      : { year: '$_id' };

  //do aggregate
  let result = await Transaction.aggregate([
    { $match: match },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: { $dateToString: { format, date: '$createdAt' } },
        totalTransactions: { $sum: 1 },
        initialBalance: { $first: '$previousBalance' },
        totalDebits: {
          $sum: {
            $cond: [{ $eq: ['$indicator', 'D'] }, '$value', 0],
          },
        },
        totalCredits: {
          $sum: {
            $cond: [{ $eq: ['$indicator', 'D'] }, 0, '$value'],
          },
        },
        finalBalance: { $last: '$currentBalance' },
      },
    },
    { $sort: { _id: 1 } },
  ])
    .addFields(addFields)
    .project('-_id');

  //return error if result not found
  if (result.length === 0) {
    errors.transactionsNotFound('account', account, period, type);
  }

  //return result if found
  return result;
}

async function getAccounts(category = 'all') {
  const condition = category === 'all' ? {} : { category };

  const result = await Account.find(condition, '-user -customer');

  if (result.length === 0) {
    errors.accountsNotFound(category);
  }

  return result;
}

async function getTotalAccounts(category = 'all') {
  const match = category === 'all' ? {} : { category };

  let result = await Account.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalAccounts: { $sum: 1 },
        totalBalance: { $sum: '$balance' },
      },
    },
  ]).project('-_id');

  if (result.length === 0) {
    errors.accountsNotFound(category);
  }

  return result;
}

async function getTotalTransactions(type = 'D', period, category = 'all') {
  let match = category === 'all' ? {} : { category };

  if (type === 'D') {
    period = period || new Date().toISOString().substr(0, 7);
    match = { period, ...match };
  } else {
    period = period || new Date().toISOString().substr(0, 4);
    match = {
      period: { $gte: `${period}-01`, $lte: `${period}-12` },
      ...match,
    };
  }

  const format = type === 'D' ? '%Y-%m-%d' : type === 'M' ? '%Y-%m' : '%Y';
  const addFields =
    type === 'D'
      ? { date: '$_id' }
      : type === 'M'
      ? { period: '$_id' }
      : { year: '$_id' };

  //do aggregate
  let result = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format, date: '$createdAt' } },
        totalTransactions: { $sum: 1 },
        totalDebits: {
          $sum: {
            $cond: [{ $eq: ['$indicator', 'D'] }, '$value', 0],
          },
        },
        totalCredits: {
          $sum: {
            $cond: [{ $eq: ['$indicator', 'D'] }, 0, '$value'],
          },
        },
        totalDifference: {
          $sum: {
            $multiply: [
              '$value',
              { $cond: [{ $eq: ['$indicator', 'D'] }, 1, -1] },
            ],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ])
    .addFields(addFields)
    .project('-_id');

  //return error if result not found
  if (result.length === 0) {
    errors.transactionsNotFound('category', category, period, type);
  }

  //return result if found
  return result;
}

export default {
  getUser,
  getUsers,
  getAccountByNumber,
  getAccountByUser,
  getAccountDetails,
  getAccountSummary,
  getAccounts,
  getTotalAccounts,
  getTotalTransactions,
};
