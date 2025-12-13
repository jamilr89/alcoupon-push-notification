import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const handleRefreshToken=async(req,res)=>{
    console.log("req: ",req);    
    console.log("cookies: ",JSON.stringify(req?.cookies));
    const refreshToken = req.cookies?.refreshToken;
    console.log("refresh token from cookie:",refreshToken);
    if(!refreshToken){
        return res.status(401).json({message:"No refresh token provided"});
    }
    const allUsers=await User.find({});
    console.log("all users in refresh token:",JSON.stringify(allUsers));

    const foundUser = await User.findOne({'sessions.refreshToken': refreshToken});
        console.log("found user with refresh token:",JSON.stringify(foundUser));
    if(!foundUser){
        return res.status(403).json({message:"Forbidden"});
    }
    const session = foundUser.sessions.find(
            s => s.refreshToken === refreshToken
        );

        if (!session) {
            // This should not happen if the first query matched, but is a safe guard.
            return res.status(403).json({message:"Forbidden - no session"});
        }


    jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET,(err,decoded)=>{
        console.log("decoded in refresh token",decoded);
        if (err || foundUser._id.toString() !== decoded.id){
            return res.status(403).json({message:"Forbidden"});
        }

        console.log("user in refresh token",foundUser);
        const accessToken=jwt.sign({id:foundUser._id,roles:foundUser.roles,deviceId:session?.deviceId},process.env.JWT_ACCESS_SECRET,{expiresIn:"15min"});
        console.log ("access token in refresh " + accessToken)
       return res.status(200).json({token:accessToken,roles:foundUser?.roles,username:foundUser?.username});
    })

}

export default handleRefreshToken;