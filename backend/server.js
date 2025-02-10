import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import productRoutes from './routes/product.route.js'
import { connectDB } from './lib/bd.js'
import cookieParser from 'cookie-parser'


dotenv.config()
const app = express()

const port = process.env.PORT || 9000


app.use(express.json())  //allows you to parse the body of the request
app.use(cookieParser())



app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
    connectDB()
}) 