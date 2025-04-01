import cartModel from '../../../DB/Models/cart.model.js';


export const addToCart =async(req,res)=>{

    const {productId}=req.body;
    const cart=await cartModel.findOne({userId:req.id});

    if(!cart){
        const newcart=await cartModel.create({
            userId:req.id,
            products:{productId}
        });
      return res.status(201).json({message:"success",cart:newcart});
    }
    for(let i=0;i<cart.products.length;i++){
        if(cart.products[i].productId ==productId){
            return res.status(409).json({message:"product already added"});
        }
    }
cart.products.push({productId});
await cart.save();
    return res.status(201).json({message:"success"});
   
}
