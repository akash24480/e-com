import express from 'express'
import {getAllProducts} from '../controller/product.controller.js'

const router = express.Router()


router.get("/", protectRoute, adminRoute, getAllProducts)


export default router
