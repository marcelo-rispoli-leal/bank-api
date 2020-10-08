//imports dependencies
import { db } from '../services/db.js';
import errors from '../libs/errors.js';
import alerts from '../libs/alerts.js';
import emails from '../libs/mailer.js';
import parsers from '../libs/parsers.js';
import getters from '../libs/getters.js';
import { setAuthToken, setResetToken } from '../libs/setters.js';
import { renameFile, deleteFile } from '../libs/fileManager.js';

const User = db.userModel;

//user creation
const createUser = async (req, res, next) => {
  try {
    //checks body and loads fields
    errors.requiredBody(req.body);
    let { name, CPForCNPJ, email, password } = req.body;

    //checks required fields
    errors.requiredFields({ name, CPForCNPJ, email, password });

    //checks and formats CPF or CNPJ or sends error
    CPForCNPJ = parsers.CPForCNPJ(CPForCNPJ);

    //checks email or sends error
    errors.invalidEmail(email);

    //checks if user already exists
    await getters.getUser(CPForCNPJ, '_id', false);

    //formats valid phones or adds an alert with invalid numbers
    const { mobilePhone, fixedPhone } = req.body;
    let phones = alerts.phoneNotRecorded(mobilePhone, fixedPhone);
    let alert = phones.alert;

    //renames uploaded PDF or alerts that the account is opened after upload
    req.file !== undefined
      ? renameFile(req.file, CPForCNPJ)
      : (alert = { ...alert, file: alerts.userNotUploadPDF() });

    //creates user
    const record = new User({
      name,
      CPForCNPJ,
      email,
      password,
      mobilePhone: phones.mobilePhone,
      fixedPhone: phones.fixedPhone,
      fileName: req.file && req.file.filename,
      filePath: req.file && req.file.path,
    });
    let user = await record.save();

    //sets auth token
    user.token = await setAuthToken(
      user._id,
      CPForCNPJ,
      user.worker,
      user.customer,
      false
    );

    //unsets these fields to not return in response
    user.worker = undefined;
    user.customer = undefined;

    //sends response with saved user and alerts
    res.send({ user, alert });
  } catch (err) {
    //deletes uploaded file on error
    deleteFile(req.file);

    next(err);
  }
};

//user authenticatin - see a "Very Important" comment
const authUser = async (req, res, next) => {
  try {
    //checks body and loads fields
    errors.requiredBody(req.body);
    let { CPForCNPJ, password } = req.body;

    //checks required fields
    errors.requiredFields({ CPForCNPJ, password });

    //checks and formats CPF or CNPJ
    CPForCNPJ = parsers.CPForCNPJ(CPForCNPJ);

    //checks if user not found
    const user = await getters.getUser(CPForCNPJ, 'password worker customer');

    //checks password
    await errors.invalidUserPass(password, user.password);

    /*********************
    Very Important - Start
    **********************

    This is the way to set the first worker user.

    Thus, this user can authenticate to update the user registration 
    of other workers and yours. 

    After adjusting the user registration of the first workers, 
    the WORKERCPF environment variable must be cleared or deleted.

    It's recommended delete the WORKERCPF environment variable, 
    the "if" snippet below and all this "Very Important" comment. */

    if (process.env.WORKERCPF === CPForCNPJ && user.worker === false) {
      user.worker = true;
    }
    /**********************
    Very Important - Finish
    **********************/

    //generates token and sends it in response
    res.send(
      await setAuthToken(user._id, CPForCNPJ, user.worker, user.customer)
    );
  } catch (err) {
    next(err);
  }
};

//user forgot pass
const forgotPass = async (req, res, next) => {
  try {
    //checks body and loads fields
    errors.requiredBody(req.body);
    let { CPForCNPJ } = req.body;

    //checks and formats CPF or CNPJ
    CPForCNPJ = parsers.CPForCNPJ(CPForCNPJ);

    //checks if user not found
    const user = await getters.getUser(CPForCNPJ, 'email');

    //generates reset password crypto token
    const token = await setResetToken(user._id);

    //sends forgot password email
    emails.forgotPassMail(user.email, token);

    //sends successful response
    res.send({ success: 'Forgot password email sended.' });
  } catch (err) {
    next(err);
  }
};

//user reset pass forgotten
const resetPass = async (req, res, next) => {
  try {
    //checks body and loads fields
    errors.requiredBody(req.body);
    let { CPForCNPJ, password, token } = req.body;

    //checks required fields
    errors.requiredFields({ CPForCNPJ, password, token });

    //checks and formats CPF or CNPJ
    CPForCNPJ = parsers.CPForCNPJ(CPForCNPJ);

    //checks if user not found
    const user = await getters.getUser(
      CPForCNPJ,
      `resetPassToken resetPassExpires`
    );

    //checks reset token content
    errors.invalidResetToken(token, user.resetPassToken, user.resetPassExpires);

    //updates password
    user.password = password;
    user.save();

    //sends successful response
    res.send({ success: 'Password redefined.' });
  } catch (err) {
    next(err);
  }
};

export default { createUser, authUser, forgotPass, resetPass };
