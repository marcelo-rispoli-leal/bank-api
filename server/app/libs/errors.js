import validator from 'validator';
import bcrypt from 'bcryptjs';

//sends message error
function msgError(error, status = 400) {
  throw new Error(JSON.stringify({ status, error }));
}

//#region required content errors
const requiredBody = (reqBody) => {
  if (Object.keys(reqBody).length === 0) {
    msgError(`The request body must have fields informed.`);
  }
};

const requiredParams = (reqParams) => {
  if (Object.keys(reqParams).length === 0) {
    msgError(`The request parameters must have fields informed.`);
  }
};

const requiredFields = (obj) => {
  let required = '';
  let omitted = '';
  let verb = '';
  let subject = '';
  let chk = false;

  //records the name of all required objects and lists the undefined ones
  Object.getOwnPropertyNames(obj).forEach((val) => {
    if (!obj[val]) {
      chk = true;
      omitted += omitted === '' ? `'${val}'` : `, '${val}'`;
      subject = subject === '' ? `field` : `fields`;
      verb = verb === '' ? `has` : `have`;
    }
    required += required === '' ? `'${val}'` : `, '${val}'`;
  });

  //triggers error message if one required object are undefined
  if (chk) {
    if (required.includes(', ')) {
      msgError(
        `The fields ${required} are required in this request, ` +
          `but the ${subject} ${omitted} ${verb} been omitted.`
      );
    } else {
      msgError(
        `The field ${required} is required in this request, ` +
          `but ${verb} been omitted.`
      );
    }
  }
};

const requiredPDF = (isWorker = false) => {
  let msg = !isWorker
    ? `This request must have a PDF file uploaded. `
    : `The user didn't upload a file. `;
  msg += `The account is created after sending and approving the documentation.`;

  msgError(msg);
};

const requiredZeroBalance = (account, balance) => {
  if (balance !== 0) {
    msgError(
      `Operation not allowed. To delete the account '${account}' the ` +
        `balance must be zero, but the current amount is '${balance}'.`
    );
  }
};
//#endregion

//#region duplicate values errors
const userAlreadyExists = (CPForCNPJ) => {
  const field = CPForCNPJ.length === 14 ? 'CPF' : 'CNPJ';
  msgError(`User with ${field} '${CPForCNPJ}' already registered.`);
};

const userAlreadyIsCustomer = (CPForCNPJ, customer = false) => {
  if (customer === true) {
    const field = CPForCNPJ.length === 14 ? 'CPF' : 'CNPJ';
    msgError(`User with ${field} '${CPForCNPJ}' already is customer.`);
  }
};
//#endregion

//#region not found errors
const userNotFound = (CPForCNPJ) => {
  const field = CPForCNPJ.length === 14 ? 'CPF' : 'CNPJ';
  msgError(`User with ${field} '${CPForCNPJ}' not found.`, 404);
};

const usersNotFound = (category = 'all', nameFilter = '') => {
  let msgPrefix =
    category === 'all'
      ? 'Users'
      : category === 'unchecked'
      ? 'Unchecked users'
      : category === 'PJ'
      ? 'Legal person users'
      : category === 'PF'
      ? 'Physical person users'
      : 'Worker users';

  if (nameFilter.trim() !== '') {
    msgPrefix += ` with case-insensitive name containing '${nameFilter.trim()}'`;
  }

  msgError(`${msgPrefix} not found.`, 404);
};

const accountNotFound = (account) => {
  msgError(`Account '${account}' not found.`, 404);
};

const accountsNotFound = (category = 'all') => {
  let msgPrefix =
    category === 'all'
      ? 'Accounts'
      : category === 'PF'
      ? 'Physical person accounts'
      : 'Legal person accounts';

  msgError(`${msgPrefix} not found.`, 404);
};

const transactionsNotFound = (entity, value, period, type) => {
  type = type === 'D' ? 'month' : 'year';
  msgError(
    `Transactions not found in the ${type} '${period}' and ${entity} '${value}'.`,
    404
  );
};
//#endregion

//#region invalid values
const invalidCPForCNPJ = (CPForCNPJ) => {
  msgError(`'${CPForCNPJ}' is not a valid CPF or CNPJ.`);
};

const invalidCPF = (CPF) => {
  msgError(`'${CPF}' is not a valid CPF.`);
};

const invalidEmail = (email) => {
  if (!validator.isEmail(email)) {
    msgError(`'${email}' is not a valid email.`);
  }
};

const invalidPhoneNumber = (number, isMobile = true) => {
  const type = isMobile ? 'mobile' : 'fixed';
  msgError(
    `The number '${number}' is not a valid Brazilian ` +
      `${type} phone according to Google rules.`
  );
};

const invalidTransaction = (balance, value) => {
  if (balance < value) {
    msgError(
      `Transaction invalid. The available balance is '${balance}' ` +
        `and it is not enough for the amount of this request, '${value}'.`
    );
  }
};

const invalidPeriod = (period, type = 'D') => {
  //message error suffix
  const format = type === 'D' ? 'yyyy-mm' : 'yyyy';
  const msgSuffix = `Use the format '${format}'.`;
  const conditionPeriod =
    type === 'D'
      ? period.length !== 7 || period.substr(4, 1) !== '-'
      : period.length !== 4;
  const testPeriod =
    type === 'D'
      ? new Date(period + '-01T00:00:00')
      : new Date(period + '-01-01T00:00:00');

  //check period condition
  if (conditionPeriod) {
    msgError(
      `The value '${period}' in the 'period' field is invalid. ` + msgSuffix
    );
  }

  //test period
  if (isNaN(testPeriod)) {
    msgError(
      `The 'period' field with value '${period}' is not valid. ` + msgSuffix
    );
  }
};

const invalidUserPass = async (reqPass, userPass) => {
  if (!(await bcrypt.compare(reqPass, userPass))) {
    msgError(`Incorret password informed.`);
  }
};

const invalidResetToken = (reqToken, userToken, userTokenExpires) => {
  if (reqToken !== userToken) {
    msgError('Incorrect token for password reset informed.');
  }

  const now = new Date();
  if (now > userTokenExpires) {
    msgError('Token for password reset expired. Request a new one.');
  }
};
//#endregion

//#region number errors
const numberIsNaN = (field, number) => {
  msgError(`The ${field} must be a number, but '${number}' is not.`);
};

const numberLessMinimum = (field, number, min) => {
  msgError(
    `The ${field} must be equal or greater than '${min}', but '${number}' is not.`
  );
};

const numberGreaterMaximum = (field, number, max) => {
  msgError(
    `The ${field} must be equal or less than '${max}', but '${number}' is not.`
  );
};
//#endregion

//#region jwt authentication errors
const jwtAuthHeaderFailure = (authHeader) => {
  //check token informed
  if (!authHeader) {
    msgError('No token provided.', 401);
  }

  //check token parts
  const parts = authHeader.split(' ');
  if (!parts.length === 2) {
    msgError('Token does not have two parts.', 401);
  }

  //check token prefix
  if (!/^Bearer$/i.test(parts[0])) {
    msgError('Malformed token, the prefix is ​​invalid.', 401);
  }
};

const jwtRejected = (message) => {
  msgError('Token invalid, ' + message + '.', 401);
};

const jwtReplaced = (reqToken, userToken) => {
  if (reqToken !== userToken) {
    msgError('The provided token has been replaced and discontinued.', 401);
  }
};
//#endregion

//#region access rights errors
const userAccessOnly = (reqCustomer = true) => {
  if (reqCustomer !== false) {
    msgError(
      `This content can only be accessed by users without an account at this bank. ` +
        `This change is carried out by our support team through a ticket.`,
      403
    );
  }
};

const workerAccessOnly = (reqWorker = false) => {
  if (reqWorker !== true) {
    msgError(
      'This content can only be accessed by employees of this bank.',
      403
    );
  }
};

const customerAccessOnly = (reqCustomer = false) => {
  if (reqCustomer !== true) {
    msgError(
      'This content can only be accessed by customers of this bank. Open your account.',
      403
    );
  }
};
//#endregion

export default {
  //required content errors
  requiredBody,
  requiredParams,
  requiredFields,
  requiredPDF,
  requiredZeroBalance,
  //duplicate errors
  userAlreadyExists,
  userAlreadyIsCustomer,
  //not found errors
  userNotFound,
  usersNotFound,
  accountNotFound,
  accountsNotFound,
  transactionsNotFound,
  //invalid values errors
  invalidCPForCNPJ,
  invalidCPF,
  invalidEmail,
  invalidPhoneNumber,
  invalidTransaction,
  invalidPeriod,
  invalidUserPass,
  invalidResetToken,
  //number errors
  numberIsNaN,
  numberLessMinimum,
  numberGreaterMaximum,
  //jwt errors
  jwtAuthHeaderFailure,
  jwtRejected,
  jwtReplaced,
  //access rights errors
  userAccessOnly,
  workerAccessOnly,
  customerAccessOnly,
};
