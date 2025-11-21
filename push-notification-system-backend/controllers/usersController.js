import User from "../models/userModel.js";
import bcrypt from "bcryptjs";


const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password -refreshToken');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getUsers = async (req, res) => {
    try {
        // Fetch all users excluding sensitive fields
    
        const users = await User.find().select('-password -refreshToken');
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, roles ,password} = req.body;
        const updates = {};
        if (username) updates.username = username;
        if (roles) updates.roles = JSON.parse(roles);
        if (password) updates.password = await bcrypt.hash(password,10);

        console.log("updates "+JSON.stringify(updates))

        // Update user by ID
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password -refreshToken');
        console.log("updatedUser "+JSON.stringify(updatedUser))
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update user "+error)
        return res.status(500).json({ message:error.code === 11000 ? "username is already taken" : "Internal Server Error" });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete user by ID
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getUserRolesOptions = async (req, res) => {
    try {
     
        const userRoles = User.schema.path("roles").caster.enumValues
        console.log('User roles from backend:', JSON.stringify(userRoles));
        return res.status(200).json(userRoles);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export {
    getUsers,
    updateUser,
    deleteUser,
    getUserRolesOptions,
    getUser
}