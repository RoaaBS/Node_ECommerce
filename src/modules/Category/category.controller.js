import slugify from 'slugify';
import categoryModel from '../../../DB/Models/category.model.js';
export const create= async (req,res)=>{
    const{name}=req.body;
    const slug=slugify(name);
    const category =await categoryModel.create(req.body);
    return res.status(201).json({message:"success",category});
}
export const get=async (req,res)=>{
    const categories= await categoryModel.find({})
    return res.status(200).json({message:"success",categories});

}

export const getActive=async (req,res)=>{
    const categories= await categoryModel.find({status:'active'})
    return res.status(200).json({message:"success",categories});

}

export const remove=async (req,res)=>{
    const {id}=req.params;
    const categories= await categoryModel.findByIdAndDelete(id);
    if(!categories){
        return res.status(404).json({message:"Category not found"});
    }
    return res.status(200).json({message:"success"});
}