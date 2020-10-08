import { formatPhoneBR } from './formatters.js';

//formats valid phones and or alerts invalid numbers
const phoneNotRecorded = (mobilePhone, fixedPhone) => {
  //declares initial constants and variables
  let alert = undefined;
  const alertPrefix = `was not recorded because it is not a valid Brazilian`;
  const alertSuffix = `phone number according to Google rules.`;

  //checks and formats mobile phone number or adds alert if invalid
  let tempPhone = formatPhoneBR(mobilePhone, true);
  if (mobilePhone !== undefined && tempPhone === undefined) {
    alert = {
      mobilePhone: `'${mobilePhone}' ${alertPrefix} mobile ${alertSuffix}`,
    };
  }
  mobilePhone = tempPhone;

  //checks and formats fixed phone number or adds alert if invalid
  tempPhone = formatPhoneBR(fixedPhone, false);
  if (fixedPhone !== undefined && tempPhone === undefined) {
    alert = {
      ...alert,
      fixedPhone: `'${fixedPhone}' ${alertPrefix} fixed ${alertSuffix}`,
    };
  }
  fixedPhone = tempPhone;

  //returns phones and alert
  return { mobilePhone, fixedPhone, alert };
};

//alerts missing PDF file upload
const userNotUploadPDF = () => {
  let alert = `You didn't upload the PDF file. The account is `;
  alert += `created after sending and approving the documentation.`;
  return alert;
};
export default { phoneNotRecorded, userNotUploadPDF };
