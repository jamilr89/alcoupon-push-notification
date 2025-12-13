import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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


const newJwtRefreshToken = jwt.sign({id:user._id},process.env.JWT_REFRESH_SECRET,{expiresIn:"15d"});
let deviceId ;
const refreshToken = req.cookies?.refreshToken;
let foundUser;
if (refreshToken) {
    console.log("Existing refresh token found in cookies during login.");
      foundUser = await User.findOne({'sessions.refreshToken': refreshToken});
    if (foundUser) {
          const session = foundUser.sessions.find(
            s => s.refreshToken === refreshToken
        );
        deviceId=session?.deviceId;

        console.log("Found user with existing refresh token during login. Removing old session.");
        await User.updateOne(
            { "_id": foundUser?._id, "sessions.deviceId": session?.deviceId },
  { 
    "$set": {
      "sessions.$[session].refreshToken": newJwtRefreshToken,
      // ... other session details to update
    }
  },
  { "arrayFilters": [{ "session.deviceId": session?.deviceId }] }
        );
    }
    // Optionally, you might want to verify and invalidate the existing refresh token here.
    // For simplicity, we'll just log it.
}
   console.log("found user during login to update/create session:",JSON.stringify(foundUser));
if (!foundUser)
{ deviceId=crypto.randomUUID()
    try { 
        const newSession = {
            deviceId: deviceId,
            refreshToken: newJwtRefreshToken,
            userAgent: req.get('User-Agent') || 'Unknown Device',
            ipAddress: req.ip,
            createdAt: new Date(),
            lastUsed: new Date(),
        // ... all other session details
    };
    await User.updateOne(
        { "_id": user?._id },
        { "$push": { "sessions": newSession } }
    );} catch (error) {
        console.error("Error creating new session during login:", error);
        return res.status(500).json({message:"Internal Server Error"});
    }}




const jwtAccessToken = jwt.sign({id:user._id,roles:user.roles,deviceId},process.env.JWT_ACCESS_SECRET,{expiresIn:"15min"});




            res.cookie("refreshToken",newJwtRefreshToken,{httpOnly:true,sameSite: 'Strict',maxAge:1*24*60*60*1000,secure:false});
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