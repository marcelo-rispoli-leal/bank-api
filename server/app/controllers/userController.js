import { db } from '../services/db.js';
import errors from '../libs/errors.js';
import parsers from '../libs/parsers.js';
import getters from '../libs/getters.js';
import emails from '../libs/mailer.js';
import { setUserById } from '../libs/setters.js';
import { renameFile, deleteFile } from '../libs/fileManager.js';

const User = db.userModel;

//authenticated user gets his own data
const findById = async (req, res, next) => {
  try {
    res.send(
      await User.findById(req.userId, '+mobilePhone +fixedPhone +createdAt')
    );
  } catch (err) {
    next(err);
  }
};

//worker gets a user's data
const findOne = async (req, res, next) => {
  try {
    //checks access rights
    errors.workerAccessOnly(req.worker);

    //checks params and loads field
    errors.requiredParams(req.params);
    let { CPForCNPJ } = req.params;

    //checks required field
    errors.requiredFields({ CPForCNPJ });

    //checks and formats CPF or CNPJ
    CPForCNPJ = parsers.CPForCNPJ(CPForCNPJ);

    //sends error if user not founded or loads your data
    const user = await getters.getUser(
      CPForCNPJ,
      '+mobilePhone +fixedPhone +createdAt'
    );

    //sends response with loaded user
    res.send(user);
  } catch (err) {
    next(err);
  }
};

//worker gets users list by category and / or name filter
function findAll(category) {
  return async (req, res, next) => {
    try {
      //checks access rights
      errors.workerAccessOnly(req.worker);

      //loads users or sends a error if not found
      const users = await getters.getUsers(category, req.query.name);

      //sends result
      res.send(users);
    } catch (err) {
      next(err);
    }
  };
}

//worker grants or revokes worker access privileges to a user
function setWorker(worker = true) {
  return async (req, res, next) => {
    try {
      //check access rights
      errors.workerAccessOnly(req.worker);

      //check body and load fields
      errors.requiredBody(req.body);
      let { CPF } = req.body;

      //check required fields
      errors.requiredFields({ CPF });

      //check and format body CPF
      CPF = parsers.CPF(CPF);

      //check if user not found
      const user = await getters.getUser(CPF);

      //update user
      const result = await setUserById(user._id, { worker }, '+worker');

      res.send(result);
    } catch (err) {
      next(err);
    }
  };
}

//non-customer user updates his own name
const setName = async (req, res, next) => {
  try {
    //checks access rights
    errors.userAccessOnly(req.customer);

    //checks body and load field
    errors.requiredBody(req.body);
    const { name } = req.body;

    //checks required field
    errors.requiredFields({ name });

    //updates user
    const user = await setUserById(req.userId, { name }, '+name');

    //sends updated user in response
    res.send(user);
  } catch (err) {
    next(err);
  }
};

//non-customer user updates his own PDF documentation file
const setFile = async (req, res, next) => {
  try {
    //checks access rights.
    //Only users without account can update register files
    errors.userAccessOnly(req.customer);

    //renames file or sends error if not uploaded
    if (req.file) {
      req.file = renameFile(req.file, req.CPForCNPJ);
    } else {
      errors.requiredPDF(false);
    }

    //updates user PDF file and returns old file path
    const user = await User.findByIdAndUpdate(
      req.userId,
      { fileName: req.file.filename, filePath: req.file.path },
      { projection: '+filePath' }
    );

    //deletes previous uploaded file
    deleteFile({ path: user.filePath });

    //adds the new filename in the response and sends result
    user.fileName = req.file.filename;
    res.send(user);
  } catch (err) {
    //deletes uploaded file on error
    deleteFile(req.file);

    next(err);
  }
};

//user updates his own email
const setEmail = async (req, res, next) => {
  try {
    //checks body and loads field
    errors.requiredBody(req.body);
    const { email } = req.body;

    //checks required field
    errors.requiredFields({ email });

    //checks new email
    errors.invalidEmail(email);

    //updates user
    const user = await setUserById(req.userId, { email }, '+email');

    res.send(user);
  } catch (err) {
    next(err);
  }
};

//user updates his own cel phone number
const setMobilePhone = async (req, res, next) => {
  try {
    //checks body and load field
    errors.requiredBody(req.body);
    let { mobilePhone } = req.body;

    //checks required field
    errors.requiredFields({ mobilePhone });

    //formats phone or return error
    mobilePhone = parsers.phoneNumberBR(mobilePhone, true);

    //updates user mobile phone
    const user = await setUserById(req.userId, { mobilePhone }, '+mobilePhone');

    res.send(user);
  } catch (err) {
    next(err);
  }
};

//user updates his own landline number
const setFixedPhone = async (req, res, next) => {
  try {
    //checks body and loads field
    errors.requiredBody(req.body);
    let { fixedPhone } = req.body;

    //checks required field
    errors.requiredFields({ fixedPhone });

    //formats phone or returns error
    fixedPhone = parsers.phoneNumberBR(fixedPhone, false);

    //updates user
    const user = await setUserById(req.userId, { fixedPhone }, '+fixedPhone');

    res.send(user);
  } catch (err) {
    next(err);
  }
};

//user updates his own email and phones
const updateOne = async (req, res, next) => {
  try {
    //checks body and loads fields
    errors.requiredBody(req.body);
    let { email, mobilePhone, fixedPhone } = req.body;

    //checks required fields
    errors.requiredFields({ email, mobilePhone, fixedPhone });

    //checks new email
    errors.emailInvalid(email);

    //formats valid phones or adds an alert with invalid numbers
    let phones = alerts.phoneNotRecorded(mobilePhone, fixedPhone);

    //updates user
    const user = await setUserById(
      req.userId,
      { email, mobilePhone: phones.mobilePhone, fixedPhone: phones.fixedPhone },
      '+mobilePhone +fixedPhone'
    );

    //send response with updated user and alerts
    res.send({ user, alert: phones.alert });
  } catch (err) {
    next(err);
  }
};

//deletes an account and revoke customer access to user
const deleteOne = async (req, res, next) => {
  try {
    let account = undefined;
    if (req.customer) {
      //gets account by user if customer
      account = await getters.getAccountByUser(req.userId, '-user -_id');

      //checks customer balance. User is deleted if balance equal zero
      errors.requiredZeroBalance(account.account, account.balance);
    }

    //deletes user from database
    const projection = '-_id email filePath';
    const user = await User.findByIdAndRemove(req.userId, { projection });

    //sends email to report the deletion
    if (!req.customer) {
      //deletes uploaded file if non-customer
      deleteFile({ path: user.filePath });
      emails.deletedUserMail(user.email, req.CPForCNPJ);
    } else {
      emails.deletedCustomerMail(user.email, account.account);
    }

    //sends success response
    res.send({ success: `User '${req.CPForCNPJ}' deleted.'` });
  } catch (err) {
    next(err);
  }
};

export default {
  findById,
  findOne,
  findAll,
  setWorker,
  setName,
  setFile,
  setEmail,
  setMobilePhone,
  setFixedPhone,
  updateOne,
  deleteOne,
};
