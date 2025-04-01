import slugify from "slugify";
import categoryModel from "../../../DB/Models/category.model.js";
import cloudinary from '../../utilitys/cloudinary.js';
import productModel from "../../../DB/Models/product.model.js";

export const create = async (req, res) => {
    const { name, categoryId ,discount,price} = req.body;
    try {
        const checkCategory = await categoryModel.findById(categoryId);
        if (!checkCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Upload Main Image to Cloudinary
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path,
            {folder:`${process.env.App_NAME}/products/${name}`});
        req.body.mainImage = { secure_url, public_id };

        // Upload Sub Images to Cloudinary
        req.body.subImages = [];
        if (req.files.subImages) {
            for (const file of req.files.subImages) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,{
                    folder:`${process.env.App_NAME}/products/${name}/subImage`
                });
                req.body.subImages.push({ secure_url, public_id });
            }
        }

        req.body.slug = slugify(name);
        req.body.createdBy = req.id;
        req.body.updatedBy = req.id;
        req.body.priceAfterDiscount=price -(price *((discount||0)/100));
       
        

        const product = await productModel.create(req.body);
        
        return res.status(201).json({
            message: "Success",
            product: {
                ...product.toObject(),
                mainImage: req.body.mainImage, 
                subImages: req.body.subImages   
            }
        });
        
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const get=async(req,res)=>{
    const products =await productModel.find({})

    return res.status(200).json({message:"success",products});
}
export const getActive=async(req,res)=>{
    const products =await productModel.find({status:'active'}).select(' mainImage name price discount')

    return res.status(200).json({message:"success",products});
}
export const getDetails=async(req,res)=>{
    const {id}=req.params;
    const product =await productModel.findById(id).select('-discount')

    return res.status(200).json({message:"success",product});
}
export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete Main Image
        if (product.mainImage?.public_id) {
            console.log("Deleting image with public_id:", product.mainImage.public_id);
            const cloudinaryResponse = await cloudinary.uploader.destroy(product.mainImage.public_id);
            console.log("Cloudinary Response:", cloudinaryResponse);

            if (cloudinaryResponse.result !== "ok") {
                return res.status(500).json({ message: "Failed to delete image from Cloudinary" });
            }
        }

        // Delete Sub Images
        if (product.subImages && product.subImages.length > 0) {
            const deletePromises = product.subImages.map(img => 
                cloudinary.uploader.destroy(img.public_id)
            );
            const subImageResponses = await Promise.all(deletePromises);
            
            // Ensure all deletions were successful
            if (subImageResponses.some(res => res.result !== "ok")) {
                return res.status(500).json({ message: "Failed to delete some sub-images from Cloudinary" });
            }
        }

        // Delete Product from Database
        await productModel.findByIdAndDelete(id);

        return res.status(200).json({ message: "Product and images deleted successfully" });

    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

