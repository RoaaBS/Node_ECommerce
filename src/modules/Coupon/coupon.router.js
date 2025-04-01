import {Router} from 'express'
import * as Controller from './coupon.controller.js'
import {auth} from '../../Middleware/auth.js'
const router =Router();

router.post('/create',auth(['admin']),Controller.create);
router.get('/get',auth(['admin']),Controller.get);

export default router;