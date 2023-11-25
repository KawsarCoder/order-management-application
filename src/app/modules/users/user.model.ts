import { Schema, model } from 'mongoose';
import { User, Address, FullName, Order } from './user.interface';

const fullNameSchema = new Schema<FullName>({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: { type: String, required: true, trim: true },
});

const addressSchema = new Schema<Address>({
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
});

const orderSchema = new Schema<Order>({
  productName: { type: String, required: true, trim: true },
  price: { type: Number, required: true, trim: true },
  quantity: { type: Number, required: true, trim: true },
});

const userSchema = new Schema<User>({
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
  orders: { type: [orderSchema], trim: true },
});

export const UserModel = model<User>('User', userSchema);
