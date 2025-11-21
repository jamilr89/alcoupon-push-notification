import express from "express";
import {getUser, getUsers, updateUser, deleteUser,getUserRolesOptions } from "../controllers/usersController.js";
import authMiddleWare from '../middlewares/authMiddleWare.js';
import AuthorizeRole from '../middlewares/roleMiddleWare.js';
import { optionalValidatePassword } from "../middlewares/passwordValidator.js";

const router = express.Router();


router.put('/:id',authMiddleWare,AuthorizeRole("superAdmin"),optionalValidatePassword,updateUser)
router.delete('/:id',authMiddleWare,AuthorizeRole("superAdmin"),deleteUser)
router.get('/user-roles-options',authMiddleWare,AuthorizeRole("superAdmin"),getUserRolesOptions)
router.get('/:id',authMiddleWare,AuthorizeRole("superAdmin"),getUser)
router.get('/',authMiddleWare,AuthorizeRole("superAdmin"),getUsers)


export default router;