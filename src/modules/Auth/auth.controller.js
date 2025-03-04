import userModel from "../../../DB/Models/user.model.js";
import bcrypt from "bcryptjs"
import SendEmail from "../../utilitys/SendEmail.js"
import jwt from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';

export const register=async(req,res,next)=>{
    const {userName,email,password}=req.body;
    const user =await userModel.findOne({email});
    if(user){
        return res.status(404).json({message:"email already exists"})
    }
const hashpassword=await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));
const createUser =await userModel.create({userName,email,password:hashpassword});
const token=jwt.sign({email},process.env.CONFIRMEMAILSIGN)
const html = `
<div> 
  <h1>Welcome ${userName}</h1>
  <h2>Confirm Email</h2>
  <a href="${req.protocol}//${req.headers.host}/auth/confirmEmail/${token}">Confirm your Email</a>
</div>`;

await SendEmail(email,"Confirm Password",html)
return res.status(200).json({message:"user created successfully",user:createUser});
}

export const confirmEmail = async (req, res) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.CONFIRMEMAILSIGN);

    const user = await userModel.findOneAndUpdate(
        { email: decoded.email },
        { confirmEmail: true },
        { new: true }
    );

    return res.status(200).json({ message: "Email confirmed successfully" });
};

export const login =async(req,res)=>{
    const {email,password}=req.body;
    const user =await userModel.findOne({email:email});
    if(!user){
        return res.status(400).json({message:"invalid Data"})
    }
    if(!user.confirmEmail){
        return res.status(400).json({message:"please confirm your email"})
    }
    if(user.status =='not_active'){
        return res.status(400).json({message:"your acount is blocked"})
    }
    const check = await bcrypt.compare(password,user.password);
    if(!check){
        return res.status(400).json({message:"invalid data"})
    }
    const token = jwt.sign({id:user._id,userName:user.userName,role:user.role},process.env.LOGIN_SIGN)
    return res.status(200).json({message:"success" ,token});

}



export const sendCode = async (req, res) => {

        const { email } = req.body;
        const code = customAlphabet('1234567890abcdefABCD', 4)();
        const user = await userModel.findOneAndUpdate({ email },{ sendCode: code },{ new: true } );
        const html = `<h2>Your verification code is: <strong>${code}</strong></h2>`;
        await SendEmail(email, 'Reset Password', html);

        return res.status(200).json({ message: "Success" });

};


export const resetPassword =async (req,res)=>{
    const{email,code,password}=req.body;
  const user =await userModel.findOne({email});
  if(!user){
    return res.status(400).json({message:"User not found"});
  }
  if(user.sendCode !=code){
    return res.status(400).json({message:"Invalid Code"});
  }
  const hashpassword= await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));
  user.password=hashpassword;
  user.sendCode=null;
  await user.save();
  return res.status(200).json({message:"Success"});
}