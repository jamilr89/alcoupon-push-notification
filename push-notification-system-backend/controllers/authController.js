import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register =async (req, res) => {
    console.log("Register request body:", req.body);
    const {username,roles,password} = req.body;
 try{   
const hashedPassword = await bcrypt.hash(password,10);
console.log("roles type "+typeof roles)

const rolesArray= typeof roles === "string" ? JSON.parse(roles) : roles;
const newUSer =new User({username,password:hashedPassword,roles:((!rolesArray||!rolesArray?.includes("user")) ? [...(rolesArray||[]) ,"user"]:rolesArray)});
await newUSer.save();
console.log(`User registered successfully: ${username}`);
   return res.status(201).json({message:`user registered ${username} successfully`});
}
catch(error){

    if (error.code === 11000)
        return res.status(500).json({message:`username ${username} is taken please use another username`});
    console.error("Registration error:", error);
    return res.status(500).json({message:"Internal Server Error"});
}
};

const login =async (req, res) => {
    console.log("in auth controller login");
    try{const {username,password} = req.body;
    const user= await User.findOne({username})
    if (!user){
        return res.status(404).json({message:"User not found"});
    }
    const isMatch = await bcrypt.compare(password,user?.password);
    console.log("isMatch "+isMatch);
if (!isMatch){
    return res.status(400).json({message:"Invalid Credentials"});
}
const jwtAccessToken = jwt.sign({id:user._id,roles:user.roles},process.env.JWT_ACCESS_SECRET,{expiresIn:"5min"});
const jwtRefreshToken = jwt.sign({id:user._id},process.env.JWT_REFRESH_SECRET,{expiresIn:"1d"});
console.log("user id "+user?._id); 

try{  await User.updateOne({_id:user?._id},{ $set: { "refreshToken": jwtRefreshToken } })
}catch(err){
            console.log("error while storing refresh token",err);}
            res.cookie("refreshToken",jwtRefreshToken,{httpOnly:true,sameSite: 'Strict',maxAge:1*24*60*60*1000,secure:false});
            console.log("login successful for user:",username);
return res.status(200).json({token:jwtAccessToken,roles:user.roles,username:user.username});
}catch(error){
    console.error("login error:", error);
    return res.status(500).json({message:"login failed"})

}
}






export {
    register,
    login
}