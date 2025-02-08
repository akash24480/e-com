import { redis } from "../lib/redis.js"
import User from "../models/user.model.js"
import jwt from 'jsonwebtoken'


const generateTokens = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn : "15m"
    })

    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn:"7d",
    })


    return {accessToken, refreshToken}
}


const storeRefreshToken = async(userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7*24*60*60)
}


const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly:true, //prevent XSS attack
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict", //csrf attack
        maxAge:15 * 60 * 60

    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly:true, //prevent XSS attack
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict", //csrf attack
        maxAge:7 * 24 * 60 * 60 * 1000, //7days

    })
}


export const signupController = async(req, res) => {
try{
    const {name, email, password} = req.body

    const existEmail = await User.findOne({email})
    if(existEmail) {
        return res.status(400).json({message: "User already exists with this email"})
    }

    const user = (await User.create({name, email, password}))

    // authenticate the user
    const {accessToken, refreshToken} = generateTokens(user._id)
    await storeRefreshToken(user._id, refreshToken)
    setCookies(res, accessToken, refreshToken)

    res.status(201).json({user:{
        _id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
    }, message: "User Created Successfully"})

}catch(error){
    console.log("error", error.message)
    return res.status(500).json({message: error.message})
}
}


export const loginController = async(req,res) => {
    try{
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(user && (await user.comparePassword(password))){
            const {accessToken, refreshToken}  = generateTokens(user._id)
            await storeRefreshToken(user._id, refreshToken)
            setCookies(res, accessToken, refreshToken)
            return res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            })
        }else{
            return res.status(401).json({message: "Invalid email or password"})
        }
    }catch(error){
        console.error("Error in the login")
        return res.status(400).json({message:error.message})
    }
}

export const logoutController = async(req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        await redis.del(`refresh_token:${decode.userId}`)

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({message:"Logged out successfully"});
    }catch(error){
        console.error("Error in the logout")
        return res.status(500).json({message:error.message})
    }
}


//This will refresh the accessToken

export const refreshToken = async(req, res) => {
    try{

        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({message:"No refresh Token provided"})
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const storedToken = await redis.get(`refreshToken:${decoded.userId}`);

        if(storedToken !== refreshToken){
            return res.status(401).json({message:"Invalid refresh token"})
        }
    }catch(error){

    }
}