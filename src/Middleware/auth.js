import jwt from 'jsonwebtoken';
import userModel from '../../DB/Models/user.model.js';
export const  auth = (accessRoles=[])=>{
    return async(req,res,next)=>{
        const {token}=req.headers;
        if(!token){
            return res.status(400).json({message:"invalid Auth"})
        }
        const decoded=jwt.verify(token,process.env.LOGIN_SIGN);
        const user=await userModel.findById(decoded.id); // to avoid logout when user change to admin 
        if(!accessRoles.includes(user.role)){

        return res.status(400).json({message:"not  Auth user"})
        }
        req.id=decoded.id;
        next();
    }
}