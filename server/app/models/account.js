import autopopulate from 'mongoose-autopopulate';
import autoincrement from 'mongoose-sequence';

export default (mongoose) => {
  const schema = mongoose.Schema({
    account: {
      type: Number,
      unique: true,
      min: 100000000,
      max: 999999999,
      immutable: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
      autopopulate: true,
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['PF', 'PJ'],
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
      select: false,
    },
    customer: {
      type: String,
      select: false,
      immutable: true,
      minLength: 14,
      maxLength: 19,
    },
  });

  schema.plugin(autoincrement(mongoose), {
    id: 'account_seq',
    inc_field: 'account',
    start_seq: 100000000,
  });

  schema.plugin(autopopulate);

  schema.method('toJSON', function () {
    const { __v, _id, user, category, ...object } = this.toObject();
    object.customerName = user.name;
    return object;
  });

  const accountModel = mongoose.model('Account', schema, 'accounts');

  return accountModel;
};
