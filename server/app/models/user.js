import bcrypt from 'bcryptjs';

export default (mongoose) => {
  const schema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      description: `User's full name.`,
    },
    CPForCNPJ: {
      type: String,
      unique: true,
      required: true,
      immutable: true,
      description:
        `CPF is the Brazilian code for individuals (physical persons) and ` +
        `CNPJ is the Brazilian code for legal entities (juridical persons). ` +
        `This code is unique for each person and is checked in our API. ` +
        `You can only inform numbers that the data will be saved and returned formatted.`,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      description: `User email. This data is validated.`,
    },
    mobilePhone: {
      type: String,
      select: false,
      description:
        `User's cell phone number in Brazil. The phone is not required, ` +
        `but if informed, it is validated according to Google rules.`,
    },
    fixedPhone: {
      type: String,
      select: false,
      description:
        `User's landline number in Brazil. The phone is not required, ` +
        `but if informed, it is validated according to Google rules.`,
    },
    worker: {
      type: Boolean,
      default: false,
      select: false,
      description:
        `Tells whether the user has employee access or not. ` +
        `Information assigned by another "worker".`,
    },
    customer: {
      type: Boolean,
      default: false,
      select: false,
      description:
        `Tells whether the user has costumer access or not. ` +
        `Information assigned when your bank account is created.`,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    token: {
      type: String,
      select: false,
    },
    resetPassToken: {
      type: String,
      select: false,
    },
    resetPassExpires: {
      type: Date,
      select: false,
    },
    fileName: {
      type: String,
      select: false,
    },
    filePath: {
      type: String,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
      immutable: true,
    },
  });

  schema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;

    next();
  });

  schema.method('toJSON', function () {
    const { __v, _id, password, filePath, ...object } = this.toObject();

    return object;
  });

  const userModel = mongoose.model('User', schema, 'users');

  return userModel;
};
