import mongoose from 'mongoose';
import { TOrder, TUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (userData: TUser) => {
  if (await User.isUserExists(userData.userId)) {
    throw new Error('User already exist!');
  }

  const result = await User.create(userData);

  return result;
};

const addOrder = async (id: string, orderData: TOrder) => {
  const userId = Number(id);
  const existUser = await User.findById(userId);
  if (existUser && orderData) {
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { orders: orderData },
      },
      { new: true, runValidators: true },
    );

    return orderData;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateUserInDB = async (id: string, updatedUserData: any) => {
  const updatedData = await User.updateOne(
    {
      _id: new mongoose.Types.ObjectId(id),
      isActive: true,
    },
    { $set: updatedUserData },
  );
  if (updatedData.modifiedCount === 1) {
    const result = await User.find({
      _id: new mongoose.Types.ObjectId(id),
      isActive: true,
    });
    return result;
  } else if (
    updatedData.modifiedCount === 0 &&
    updatedData.matchedCount === 1
  ) {
    return Promise.reject('You try to update same data');
  } else {
    return Promise.reject('user Not Found');
  }
};

const getAllUserFromDB = async () => {
  const result = await User.aggregate([
    { $match: {} },
    { $project: { password: 0 } },
  ]);
  return result;
};

const getAllOrdersFromDB = async (id: string) => {
  const existUser = await User.findById(id);
  if (existUser) {
    const result = await User.findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { orders: -1 },
    );

    return result;
  } else {
    return Promise.reject('User Not Found');
  }
};

const getSingleUserFromDB = async (id: string) => {
  const userId = Number(id);
  const result = await User.aggregate([
    { $match: { userId: userId } },
    { $project: { password: 0 } },
  ]);

  return result;
};

const deleteUserFromDB = async (userId: string) => {
  const result = await User.updateOne({ userId }, { isDeleted: true });
  return result;
};

const totalPriceFromOrders = async (id: string) => {
  const userId = Number(id);
  const result = await User.aggregate([
    {
      $match: {
        userId: userId,
      },
    },
    {
      $unwind: '$orders',
    },
    {
      $group: {
        _id: '$_id',
        totalPrice: { $sum: '$orders.price' },
      },
    },
  ]);

  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUserFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  updateUserInDB,
  addOrder,
  getAllOrdersFromDB,
  totalPriceFromOrders,
};
export default UserServices;
