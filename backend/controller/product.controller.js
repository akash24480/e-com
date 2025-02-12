import { redis } from '../lib/redis.js'
import Product from '../models/product.model.js'
import cloudinary from '../lib/cloudinary.js'

export const getAllProducts = async(req, res) => {
    try{    
        const products = await Product.find({}) //find all the products
        res.json({products})
    }catch(error){
        console.error("Error in the getAllProducts", error.message)
        return res.status(500).json({message:"Server Error", error: error.message});
    }
}


export const getFeaturedProducts = async(req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products")
        if(featuredProducts){
            return res.json(json.parse(featuredProducts))
        }

        // if it is not in the redis then we fetch it from the mongodb

        featuredProducts = await Product.find({isFeatured:true}).lean();

        if(!featuredProducts){
            return res.status(404).json({message:"No featured products found"})
        }
        // store in the redis for feature quick access

        await redis.set("featured_products", JSON.stringify(featuredProducts))
        res.json(featuredProducts);
    } catch (error) {
        
    }
}


export const createProduct = async(req,res) => {
    try {
        const {name, description, price, image, category} = req.body;

        let cloudinaryResponse = null

        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder:"products"})
        }

        const product = await Product.create({
            name,
            description,
            price,
            image:cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        })

        res.status(200).json({product})
    } catch (error) {
        console.error("Error in the createProduct Controller", error.message)
        res.status(500).json({message: "Server Error", error: error.message})
    }
}

export const deleteProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({message:"Product not found"})
        }

        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0]
            try{
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("Deleted Image from the cloudinary")
            }catch(error){
                console.log("Error deleting image from cloudinary", error)
            }
        }

        await Product.findByIdAndDelete(req.params.id)
        res.json({message:"Producted Deleted successfully"})
    } catch (error) {
        console.error("Error in the deleteProduct controller", error.message)
        res.status(500).json({message:"Server Error", error:error.message})
    }
}

export const getRecommendedProducts = async(req, res) =>{
    try{
        const products = await Product.aggregate([
            {
                $sample: {size:3}
            },

            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    image:1,
                    price:1
                }
            }
        ])

        res.json(products)
    }catch(error){
        console.error("Error in the getRecommendedProduct controller", error.message)
        res.status(500).json({message:"Server Error", error:error.message})
    }
}

export const getProductsByCategory = async(req,res) => {
    const {category} = req.params;

    try {
        const products = await Product.find({category})
        res.json(products);
    } catch (error) {
        console.error("Error in the getProductsByCategory controller", error.message);
        res.status(500).json({message:"Server Error", error:error.message})
    }
}

export const toggleFeaturedProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save()
            //update the cache
            await updateFeaturedProductsCache();
            res.json(updatedProduct)
        }
        else{
            res.status(404).json({message:"Product not found"})
        }
    } catch (error) {
        console.error("Error in the toggleFeaturedProduct", error.message)
        return res.status(500).json({message:"Server Error", error:error.message})
    }
}


async function updateFeaturedProductsCache(){
    try {
        const featuredProducts = await Product.find({isFeatured:true}).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts))
    } catch (error) {
        console.error("Error in update cache function");
    }
}
