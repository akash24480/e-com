import Coupon from '../models/coupon.model.js'
export const getCoupon = async(req, res) => {
    try {
        const coupon = await Coupon.findOne({userId:req.user._id, isActive:true})
        res.json(coupon || null);
    } catch (error) {
        console.error("Error in getCoupon controller", error.message);
        res.status(500).json({message:"Server Error", error:error.message})
    }
}

export const validateCoupon = async(req, res) => {
    try{
        const {code} = req.body;
        const coupon = await Coupon.findOne({code:code, userId:req.user._id, isActive:true});

        if(!coupon){
            return res.json(404).json({message:"Coupon not found"})
        }

        if(coupon.expirationDate < new Date()){
            coupon.isActive = false;
            await coupon.save();
            return res.json(404).json({message:"Coupon expired"})
        }

        res.json({
            message:"Coupon is Valid",
            discountPercentage:coupon.discountPercentage
        })
    }catch(error){
        console.error("Error in the validateCoupon controller", error.message)
        return res.json({message:"Server Error", error:error.message})
    }
}