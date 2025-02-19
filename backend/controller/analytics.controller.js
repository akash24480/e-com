import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js"

export const getAnalyticsData = async(req, res) => {
    const totalUser = await User.countDocuments();
    const totalProducts = await Product.countDocuments();


    const salesData = await Order.aggregate([
        {
            $group:
        }
    ])
}