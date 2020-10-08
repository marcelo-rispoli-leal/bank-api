import glpn from 'google-libphonenumber';

function isCPF(cpfText) {
  // remove non-numeric characters
  const cpf = cpfText.replace(/[^\d]+/g, '');
  if (cpf == '') return false;
  // eliminates known invalid CPFs
  if (
    cpf.length != 11 ||
    cpf == '00000000000' ||
    cpf == '11111111111' ||
    cpf == '22222222222' ||
    cpf == '33333333333' ||
    cpf == '44444444444' ||
    cpf == '55555555555' ||
    cpf == '66666666666' ||
    cpf == '77777777777' ||
    cpf == '88888888888' ||
    cpf == '99999999999'
  )
    return false;
  // valid first digit
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
  let result = 11 - (sum % 11);
  if (result == 10 || result == 11) result = 0;
  if (result != parseInt(cpf.charAt(9))) return false;
  // valid secund digit
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
  result = 11 - (sum % 11);
  if (result == 10 || result == 11) result = 0;
  if (result != parseInt(cpf.charAt(10))) return false;
  return true;
}

function isCNPJ(cnpjText) {
  // remove non-numeric characters
  const cnpj = cnpjText.replace(/[^\d]+/g, '');

  if (cnpj == '') return false;

  if (cnpj.length != 14) return false;

  // eliminates known invalid CNPJs
  if (
    cnpj == '00000000000000' ||
    cnpj == '11111111111111' ||
    cnpj == '22222222222222' ||
    cnpj == '33333333333333' ||
    cnpj == '44444444444444' ||
    cnpj == '55555555555555' ||
    cnpj == '66666666666666' ||
    cnpj == '77777777777777' ||
    cnpj == '88888888888888' ||
    cnpj == '99999999999999'
  )
    return false;

  // valid check digits
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result != digits.charAt(0)) return false;

  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result != digits.charAt(1)) return false;

  return true;
}

function isMobilePhoneBR(number) {
  try {
    const phoneUtil = glpn.PhoneNumberUtil.getInstance();
    let phone = phoneUtil.parse(number, 'BR');

    //valid BR phone
    let result = phoneUtil.isValidNumberForRegion(phone, 'BR');

    //valid mobile phone
    if (
      result === true &&
      phoneUtil.getNumberType(phone) !== glpn.PhoneNumberType.MOBILE
    ) {
      result = false;
    }

    return result;
  } catch (err) {
    return false;
  }
}

function isFixedPhoneBR(number) {
  try {
    const phoneUtil = glpn.PhoneNumberUtil.getInstance();
    let phone = phoneUtil.parse(number, 'BR');

    //valid BR phone
    let result = phoneUtil.isValidNumberForRegion(phone, 'BR');

    //valid mobile phone
    if (
      result === true &&
      phoneUtil.getNumberType(phone) !== glpn.PhoneNumberType.FIXED_LINE
    ) {
      result = false;
    }

    return result;
  } catch (err) {
    return false;
  }
}

export default { isCPF, isCNPJ, isMobilePhoneBR, isFixedPhoneBR };
