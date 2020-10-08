//imports dependencies
import mongoose from 'mongoose';
import userModel from '../models/user.js';
import accountModel from '../models/account.js';
import transactionModel from '../models/transaction.js';

//creates database connection
const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGOURL;
db.mongoose.connect(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

//associates models with the database
db.userModel = userModel(mongoose);
db.accountModel = accountModel(mongoose);
db.transactionModel = transactionModel(mongoose);

export { db };
