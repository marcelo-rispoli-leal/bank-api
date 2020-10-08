import autopopulate from 'mongoose-autopopulate';

export default (mongoose) => {
  const schema = mongoose.Schema({
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
      autopopulate: true,
      index: 1,
    },
    period: {
      type: String,
      required: true,
      immutable: true,
      index: -1,
    },
    createdAt: {
      type: Date,
      required: true,
      index: 1,
    },
    description: {
      type: String,
      required: true,
    },
    indicator: {
      type: String,
      required: true,
      enum: ['D', 'C'],
    },
    value: {
      type: Number,
      required: true,
      default: 0,
      min: 0.01,
    },
    previousBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      immutable: true,
    },
    currentBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      immutable: true,
    },
  });

  schema.plugin(autopopulate);

  schema.method('toJSON', function () {
    const { __v, _id, account, ...object } = this.toObject();
    object.account = account.account;
    object.customerName = account.user.name;
    return object;
  });

  const transactionModel = mongoose.model(
    'Transaction',
    schema,
    'transactions'
  );

  return transactionModel;
};
