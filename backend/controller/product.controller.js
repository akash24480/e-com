import Product from '../models/product.model.js'

export const getAllProducts = async(req, res) => {
    try{    
        const products = await Product.find({}) //find all the products
        res.json({products})
    }catch(error){
        console.error("Error in the getAllProducts", error.message)
        return res.status(500).json({message:"Server Error", error: error.message});
    }
}