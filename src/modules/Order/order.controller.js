import cartModel from '../../../DB/Models/cart.model.js';
import couponModel from '../../../DB/Models/coupon.model.js';
import productModel from '../../../DB/Models/product.model.js';
import OrderModel from '../../../DB/Models/order.model.js';
import userModel from '../../../DB/Models/user.model.js';
export const  create=async(req,res)=>{

    const{couponName}=req.body;
    const cart=await cartModel.findOne({userId:req.id});
    if (!cart){
        return res.status(404).json({message:"cart not found"});
    }
    if(couponName){
        const coupon =await couponModel.findOne({name:couponName});
        if(!coupon){
            return res.status(404).json({message:"coupon not found"});
        }
        if(coupon.expireDate <=new Date()){
            return res.status(400).json({message:"this coupon has expired"});
        }
        if(coupon.usedBy.includes(req.id)){
            return res.status(400).json({message:"coupon already used"})
        }
        req.body.coupon=coupon;
    }
    const finalProducts =[];
  let subTotal=0;
    for(let product of cart.products){
        const checkProduct =await productModel.findOne({
            _id:product.productId,
            stock:{$gte:product.quantity}
        });
        if(!checkProduct){
            return res.status(400).json({message:"product quantity not avaliable"});
        }
        //convert bason to json to appear name of product dispaly
        product =product.toObject();
        product.productName=checkProduct.name;
        product.unitPrice=checkProduct.price;
        product.finalPrice=product.quantity * checkProduct.priceAfeterDiscount;
        subTotal+=product.finalPrice;
        finalProducts.push(product);
    }
const user = await userModel.findById(req.id);
if(!req.body.address){
    req.body.address=user.address;
}
if(!req.body.phoneNumber){
    req.body.phoneNumber=user.phoneNumber;
}
const order=await OrderModel.create({
    UserId:req.id,
    products:finalProducts,
    couponName:couponName ?? ' ',
    address:req.body.address,
    phoneNumber:req.body.phoneNumber,
    finalPrice: subTotal - (subTotal * ((req.body.coupon?.amount || 0)) / 100),

});
for(const product of cart.products){
    await productModel.updateOne({_id:product.productId},
        {
            $inc:{
                stock:- product.quantity}
            }
        );
}
if(req.body.coupon){
    await couponModel.updateOne({_id:req.body.coupon._id},{
        $addToSet:{
            usedBy:req.id
        }
    })
}
await cartModel.updateOne({userId:req.id},{
    products:[],
});

return res.json(order);
}


export const getUserOrders=async(req,res)=>{
const orders=await OrderModel.find({UserId:req.id}).populate('products.productId');
return res.status(200).json({message:"success",orders});
};

export const getOrdersByStatus=async(req,res)=>{
    const{status}=req.params;
    const orders=await OrderModel.find({status:status}).populate('products.productId');
return res.status(200).json({message:"success",orders});
};

export const changeStatus = async (req, res) => {
    const { orderId } = req.params; 

    const order = await OrderModel.findById(orderId);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status;
    order.updatedBy = req.id;
    await order.save();

    return res.status(200).json({ message: "Success", order });
};
