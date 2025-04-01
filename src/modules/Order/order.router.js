import {Router} from 'express'
import * as Controller from './order.controller.js'
import {auth} from '../../Middleware/auth.js'
const router =Router();

router.post('/create',auth(['user']),Controller.create);
router.get('/',auth(['user']),Controller.getUserOrders);
router.get('/:status',auth(['admin']),Controller.getOrdersByStatus);
router.patch('/changeStatus/:orderId',auth(['admin']),Controller.changeStatus)


export default router; 