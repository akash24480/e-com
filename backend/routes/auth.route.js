import express from 'express'
import { signupController, loginController, logoutController, refreshToken } from '../controller/auth.controller.js'

const router = express.Router()

router.post("/signup", signupController)

router.post("/login", loginController)

router.post("/logout", logoutController)

router.post("/refresh-token", refreshToken)


export default router;