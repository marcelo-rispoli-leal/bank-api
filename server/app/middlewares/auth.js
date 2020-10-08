import jwt from 'jsonwebtoken';
import errors from '../libs/errors.js';
import { db } from '../services/db.js';

const User = db.userModel;

export default async (req, _, next) => {
  try {
    //checks authorization header
    const authHeader = req.headers.authorization;
    errors.jwtAuthHeaderFailure(authHeader);

    //checks token secret
    const token = authHeader.substr(7);
    const SECRET = process.env.SECRET;
    jwt.verify(token, SECRET, (err, decoded) => {
      //token rejected
      if (err) {
        errors.jwtRejected(err.message);
      }

      //token valid, updates request
      req.userId = decoded._id;
      req.CPForCNPJ = decoded.CPForCNPJ;
      req.worker = decoded.worker;
      req.customer = decoded.customer;
    });

    //checks user token
    const user = await User.findById(req.userId, 'token');
    errors.jwtReplaced(token, user.token);

    //token ok, go to requested route
    return next();
  } catch (err) {
    next(err);
  }
};
