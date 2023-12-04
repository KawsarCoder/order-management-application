import express from 'express';
import { UserControllers } from './user.controller';

const router = express.Router();

router.post('/', UserControllers.createUsers);

router.get('/', UserControllers.getAllUsers);

router.get('/:userId', UserControllers.getSingleUser);

router.delete('/:userId', UserControllers.deleteUser);

router.put('/:userId', UserControllers.updateUser);

router.put('/:userId/orders', UserControllers.addOrder);

router.get('/:userId/orders', UserControllers.getAllOrders);

router.get('/:userId/orders/total-price', UserControllers.totalPrice);

export const UserRoutes = router;
