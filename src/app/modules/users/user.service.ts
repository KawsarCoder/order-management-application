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

  if (await User.isUserExists(userId)) {
    const result = await User.updateMany(
      { userId: userId },
      {
        $push: {
          orders: orderData,
        },
      },
    );
    return result;
  }
  throw new Error('User not found');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateUserInDB = async (id: string, updatedUserData: any) => {
  const userId = Number(id);

  if (await User.isUserExists(userId)) {
    const result = await User.updateOne({ userId: userId }, [
      {
        $set: updatedUserData,
      },
    ]);
    return result;
  }
  throw new Error('User not found');
};

// const createOrderInDb = async (id: string, orderCreateData: TOrder) => {
//   const userId = Number(id);

//   if (await User.isUserExists(userId)) {
//     const result = await User.updateOne({ userId: userId }, [
//       {
//         $push: {
//           orders: {
//             $each: [orderCreateData],
//             $position: 0, // Optional: Specify the position where you want to add the new order
//           },
//         },
//       },
//     ]);

//     return result;
//   }

//   throw new Error('User not found');
// };

const getAllUserFromDB = async () => {
  const result = await User.aggregate([
    { $match: {} },
    { $project: { password: 0 } },
  ]);
  return result;
};

const getAllOrdersFromDB = async (id: string) => {
  const userId = Number(id);
  const result = await User.findOne({ userId: userId });
  return result;
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

export const UserServices = {
  createUserIntoDB,
  getAllUserFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  updateUserInDB,
  addOrder,
  getAllOrdersFromDB,
};
