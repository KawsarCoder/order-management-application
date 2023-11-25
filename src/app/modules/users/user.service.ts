import { TUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (userData: TUser) => {
  if (await User.isUserExists(userData.userId)) {
    throw new Error('User already exist!');
  }

  const result = await User.create(userData);

  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateUserInDB = async (id: string, updatedUserData: any) => {
  const userId = Number(id);

  if (await User.isUserExists(userId)) {
    const result = await User.updateOne({ userId: userId, updatedUserData });
    return result;
  }
  throw new Error('User not found');
};

const getAllUserFromDB = async () => {
  const result = await User.find();
  return result;
};

const getSingleUserFromDB = async (userId: string) => {
  const result = await User.findOne({ userId });

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
};
