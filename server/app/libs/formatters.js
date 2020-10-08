import glpn from 'google-libphonenumber';
import validations from './validators.js';

function formatCPF(cpf) {
  if (!validations.isCPF(cpf)) return '';

  let result = cpf.replace(/[^\d]+/g, '');

  result =
    result.substr(0, 3) +
    '.' +
    result.substr(3, 3) +
    '.' +
    result.substr(6, 3) +
    '-' +
    result.substr(9, 2);
  return result;
}

function formatCNPJ(cnpj) {
  if (!validations.isCNPJ(cnpj)) return '';

  let result = cnpj.replace(/[^\d]+/g, '');

  result =
    result.substr(0, 2) +
    '.' +
    result.substr(2, 3) +
    '.' +
    result.substr(5, 3) +
    '/' +
    result.substr(8, 4) +
    '-' +
    result.substr(12, 2);
  return result;
}

function formatCPForCNPJ(CPForCNPJ) {
  let result = formatCPF(CPForCNPJ);

  if (result === '') {
    result = formatCNPJ(CPForCNPJ);
  }

  return result;
}

function formatPhoneBR(number, isMobile) {
  if (
    (isMobile && validations.isMobilePhoneBR(number)) ||
    (!isMobile && validations.isFixedPhoneBR(number))
  ) {
    const PNF = glpn.PhoneNumberFormat;
    const phoneUtil = glpn.PhoneNumberUtil.getInstance();
    const phone = phoneUtil.parse(number, 'BR');
    return phoneUtil.format(phone, PNF.NATIONAL);
  }
}

export { formatCPF, formatCPForCNPJ, formatPhoneBR };
