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
  const existUser = await User.findOne({ userId: userId });
  if (existUser && orderData) {
    await User.updateOne(
      { userId },
      {
        $push: { orders: orderData },
      },
      { new: true, runValidators: true },
    );

    return orderData;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateUserInDB = async (id: string, updatedUserData: object) => {
  const userId = Number(id);
  const updatedData = await User.updateOne(
    {
      userId: userId,
    },
    { $set: updatedUserData },
  );
  if (updatedData.modifiedCount === 1) {
    const result = await User.findOne(
      {
        userId: userId,
      },
      { password: 0, orders: 0, isDeleted: 0, _id: 0 },
    );
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
    {
      $project: {
        password: 0,
        orders: 0,
        isDeleted: 0,
        _id: 0,
        isActive: 0,
        hobbies: 0,
      },
    },
  ]);
  return result;
};

const getAllOrdersFromDB = async (id: string) => {
  const userId = Number(id);
  const existUser = await User.findOne({ userId });
  if (existUser) {
    const result = await User.aggregate([
      { $match: { userId: userId } },
      { $project: { orders: 1, _id: 0 } },
    ]);

    return result;
  } else {
    return Promise.reject('User Not Found');
  }
};

const getSingleUserFromDB = async (id: string) => {
  const userId = Number(id);
  const result = await User.aggregate([
    { $match: { userId: userId } },
    { $project: { password: 0, orders: 0, isDeleted: 0, _id: 0 } },
  ]);

  return result;
};

const deleteUserFromDB = async (id: string) => {
  const userId = Number(id);
  const existUser = await User.findOne({
    userId,
    isDeleted: false,
  });
  // console.log(existUser);

  if (existUser) {
    const result = await User.updateOne({ userId }, { isDeleted: true });

    if (result?.acknowledged && result?.matchedCount && result?.modifiedCount) {
      return null;
    } else {
      return Promise.reject('User not found');
    }

    return result;
  } else {
    return Promise.reject('User not found');
  }
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
      $addFields: {
        sum: {
          $multiply: ['$orders.price', '$orders.quantity'],
        },
      },
    },
    {
      $group: {
        _id: '$_id',
        totalPrice: { $sum: '$sum' },
      },
    },
    {
      $project: { _id: 0, totalPrice: 1 },
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
