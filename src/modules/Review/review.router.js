import {Router} from 'express'
import * as Controller from './review.controller.js'
import {auth} from '../../Middleware/auth.js'
const router =Router({mergeParams:true});

router.post('/',auth(['user']),Controller.create);


export default router;