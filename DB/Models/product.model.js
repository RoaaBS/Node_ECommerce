
import {Schema, Types, model,mongoose} from "mongoose";
const productSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        min:3,
        max:50
    },
    description:{
        type:String,
        required:true
    },
    stock:{
    type:number,
        default:1,
    },
    price:{
    type:number,
    required:true
    },
    discount:{
    type:number,
    default:0
    },
    slug:{
        type:String,
        
    },
    status:{
        type:String,
        enum:['active','not_active'],
        default:'active'
     },
    mainImage:{
        type:Object,
        required:true

    },
    subImages:[{
   type:Object,

    },],
    createdBy:{
        type:Types.ObjectId,
        ref:'User',
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:'User',
    },
    categoryId:{
        type:Types.ObjectId,
        ref:'Category',
    },
    colors:[String], //array of color (if product have colors)
    size:[{      //size of product
        type:[String],
        enum:['small','medium','large','xlarge']
    }]
   
 
   
      },
    {
        timestamps:true,
    });

    const productModel =  mongoose.models.Category||model('Category',productSchema);
    export default productModel;