import { Schema, model } from 'mongoose';
import { TUser, TAddress, TFullName, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const fullNameSchema = new Schema<TFullName>({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: { type: String, required: true, trim: true },
});

const addressSchema = new Schema<TAddress>({
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
});

const userSchema = new Schema<TUser, UserModel>({
  userId: {
    type: Number,
    required: [true, 'userId is required'],
    unique: true,
    trim: true,
  },
  username: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  fullName: { type: fullNameSchema, required: true, trim: true },
  age: { type: Number, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  isActive: {
    type: String,
    enum: {
      values: ['active', 'blocked'],
      message: '{VALUE} is not valid',
    },
    default: 'active',
    trim: true,
  },
  hobbies: { type: [String], default: [], trim: true },
  address: { type: addressSchema, required: true, trim: true },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// pre middleware
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

// post midllerware
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// query middleware
userSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

userSchema.statics.isUserExists = async function (userId: number) {
  const existingUser = await User.findOne({ userId });

  return existingUser;
};

export const User = model<TUser, UserModel>('User', userSchema);
