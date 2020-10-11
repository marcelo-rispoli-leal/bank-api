import errors from './errors.js';
import { formatCPForCNPJ, formatCPF, formatPhoneBR } from './formatters.js';

//check, format and return CPF/CNPJ or error
function CPForCNPJ(CPForCNPJ) {
  const result = formatCPForCNPJ(CPForCNPJ);
  if (result === '') {
    errors.invalidCPForCNPJ(CPForCNPJ);
  }

  return result;
}

//check, format and return CPF or error
function CPF(CPF) {
  const result = formatCPF(CPF);
  if (result === '') {
    errors.invalidCPF(CPF);
  }

  return result;
}

//check, format and return Brazilian phone or error
function phoneNumberBR(number, isMobile) {
  const result = formatPhoneBR(number, isMobile);
  if (!result) {
    errors.invalidPhoneNumber(number, isMobile);
  }

  return result;
}

//check, format and return money value or error
function moneyNumber(value) {
  const result = +parseFloat(value).toFixed(2);

  //invalid number error
  isNaN(result) && errors.numberIsNaN('value', value);

  //number less than minimum
  const min = 0.01;
  result < min && errors.numberLessMinimum('value', value, min);

  return result;
}

//check, format and return account number or error
function accountNumber(account) {
  const result = parseInt(account);

  //invalid number error
  isNaN(result) && errors.numberIsNaN('account', account);

  //number outside range error
  const min = 100000000;
  const max = 999999999;
  result < min && errors.numberLessMinimum('account', account, min);
  result > max && errors.numberGreaterMaximum('account', account, max);

  return result;
}

function accountParam(reqParams) {
  //check body and load account
  errors.requiredParams(reqParams);
  let { account } = reqParams;

  //check required fields
  errors.requiredFields({ account });

  //check and format account number
  const result = accountNumber(account);

  return result;
}

export default {
  CPForCNPJ,
  CPF,
  phoneNumberBR,
  moneyNumber,
  accountNumber,
  accountParam,
};
