import express from 'express'
import {getAllProducts} from '../controller/product.controller.js'
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js'
import { getFeaturedProducts, createProduct } from '../controller/product.controller.js'

const router = express.Router()


router.get("/", protectRoute, adminRoute, getAllProducts)
router.get("/featured", getFeaturedProducts)
router.post("/", protectRoute, adminRoute, createProduct);
router.delete("/:id", protectRoute, adminRoute)


export default router
