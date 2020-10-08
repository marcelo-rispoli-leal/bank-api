import nodemailer from 'nodemailer';

const { MAILSMTP, MAILPORT, MAILUSER, MAILPASS } = process.env;
const secure = MAILPORT === '465' ? true : false;

const mailer = nodemailer.createTransport({
  host: MAILSMTP,
  port: MAILPORT,
  secure,
  auth: {
    user: MAILUSER,
    pass: MAILPASS,
  },
});

function sendMessage(to, subject, html) {
  mailer.sendMail({ to, subject, html }, (error) => {
    if (error) {
      throw new Error(
        JSON.stringify({
          status: 400,
          error: `Error on send email with subject '${subject}' to address '${to}'.`,
        })
      );
    }
  });
}

const forgotPassMail = (toUserMail, token) => {
  const mailMessage = {
    to: toUserMail,
    subject: 'Forgot your password?',
    html:
      '<p>Did you forget your password? ' +
      'No problem, to set a new password use the following token:</p>' +
      `<p>${token}</p>` +
      '<p>This token expires in one hour or less with you require another.</p>',
  };

  sendMessage(toUserMail, mailMessage.subject, mailMessage.html);
};

const createdAccountMail = (toUserMail, account) => {
  const mailMessage = {
    to: toUserMail,
    subject: 'Your bank account has been created!',
    html:
      `<p>Your documentation has been approved and your account is created.</p>` +
      `<p>Your bank account number is as follows:</p>` +
      `<p>${account}</p>` +
      `<p>To use the features reserved for the bank's customers, ` +
      `make a new authentication of your user in our system.</p>` +
      `<p>To make the best use of our services, follow the ` +
      `instructions in our documentation and keep your data up to date.</p>` +
      `<p>Now you are our customer, which is a great joy and ` +
      `responsibility. We are honored with the confidence you place in us. ` +
      `We will not disappoint you, we hope to surprise you positively. ` +
      `We wish and do the best for our customers.</p>` +
      `<p>Best regards.</p>`,
  };

  sendMessage(toUserMail, mailMessage.subject, mailMessage.html);
};

const deletedCustomerMail = (toUserMail, account) => {
  const mailMessage = {
    to: toUserMail,
    subject: 'Your user has been deleted and the account closed',
    html:
      `<p>Your user has been deleted and your bank account ${account} closed.</p>` +
      `<p>We hope you will be back soon.</p>` +
      `<p>When you wish, register a new user to open another account.</p>` +
      `<p>Best regards.</p>`,
  };

  sendMessage(toUserMail, mailMessage.subject, mailMessage.html);
};

const deletedUserMail = (toUserMail, CPForCNPJ) => {
  const mailMessage = {
    to: toUserMail,
    subject: 'Your data and user has been deleted',
    html:
      `<p>Your user ${CPForCNPJ} been deleted and ` +
      `your data no longer exists in our system.</p>` +
      `<p>We hope you make a new registration soon.</p>` +
      `<p>Best regards.</p>`,
  };

  sendMessage(toUserMail, mailMessage.subject, mailMessage.html);
};

export default {
  forgotPassMail,
  createdAccountMail,
  deletedUserMail,
  deletedCustomerMail,
};
