import {Router} from 'express'
import * as Controller from './auth.controller.js'
const router =Router();

router.post('/register',Controller.register)
router.get("/confirmEmail/:token", Controller.confirmEmail);
router.post('/login',Controller.login);
router.post('/sendCode',Controller.sendCode);
router.post('/resetpassword',Controller.resetPassword)
export default router;