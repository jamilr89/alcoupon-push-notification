import express from 'express';
import { login,register } from '../controllers/authController.js';
import { validatePassword } from '../middlewares/passwordValidator.js';
import logout from "../controllers/logoutController.js";

const authRouter=express.Router();
console.log("in auth route")
authRouter.post('/login',login)
authRouter.get('/logout',logout)
authRouter.post('/register',validatePassword,register)
 export default authRouter;