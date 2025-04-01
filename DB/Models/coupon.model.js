
import {Schema, Types, model,mongoose} from "mongoose";
const couponSchema = new Schema({
    name:{
        type:String,
        required:true,
        min:3,
        max:50
    },
    amount:{
        type:Number,
        required:true,
        
    },
    expireDate:{
        type:Date,
        required:true,
    },
   usedBy:[{
type:Types.ObjectId,
ref:'User'
   }],
  
    createdBy:{
        type:Types.ObjectId,
        ref:'User',
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:'User',
    },
   
 
   
      },
    {
        timestamps:true,
    });

    const couponModel =  mongoose.models.Coupon||model('Coupon',couponSchema);
    export default couponModel;