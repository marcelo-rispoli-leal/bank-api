import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../services/db.js';

const User = db.userModel;

//finds a user by id, updates, and returns projection
async function setUserById(id, update, projection = '_id', newTrue = true) {
  return await User.findByIdAndUpdate(id, update, { new: newTrue, projection });
}

//sets user authentication jwt token
async function setAuthToken(_id, CPForCNPJ, worker, customer, isAuth = true) {
  //loads environment variables
  const { SECRET, EXPIRE } = process.env;

  //sets jwt token
  const token = jwt.sign({ _id, CPForCNPJ, worker, customer }, SECRET, {
    expiresIn: +EXPIRE,
  });

  //updates user token
  const projection = isAuth ? '+token' : '_id';
  const user = await setUserById(_id, { token }, projection, isAuth);

  //returns result
  const result = isAuth ? user : token;
  return result;
}

//sets user reset password crypto token
async function setResetToken(userId) {
  //generates reset password crypto token
  const result = crypto.randomBytes(30).toString('hex');

  //sets reset token expiration
  const now = new Date();
  now.setHours(now.getHours() + 1);

  //updates user
  await setUserById(userId, { resetPassToken: result, resetPassExpires: now });

  //returns token
  return result;
}

export { setUserById, setAuthToken, setResetToken };
