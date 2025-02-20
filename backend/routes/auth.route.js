import express from 'express'
import { signupController, loginController, logoutController, refreshToken, getProfile } from '../controller/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post("/signup", signupController)

router.post("/login", loginController)

router.post("/logout", logoutController)

router.post("/refresh-token", refreshToken)

router.get("/profile",protectRoute, getProfile)


export default router;