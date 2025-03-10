
import {Schema, Types, model,mongoose} from "mongoose";
const categorySchema = new Schema({
    name:{
        type:String,
        required:true,
        min:3,
        max:50
    },
    slug:{
        type:String,
        
    },
    status:{
        type:String,
        enum:['active','not_active'],
        default:'active'
     },
    image:{
        type:Object,

    },
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

    const categoryModel =  mongoose.models.Category||model('Category',categorySchema);
    export default categoryModel;