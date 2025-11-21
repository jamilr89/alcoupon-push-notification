import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


const logoutHandler = async (req,res)=>{
    try{
const user = await User.updateOne({refreshToken:req.cookies?.refreshToken},{"refreshToken":""});
    // if(err){
    //     console.log("error while deleting refresh token",err);
    //     return res.sendStatus(500);
    // }

    res.clearCookie("refreshToken",{httpOnly:true,sameSite:"None"});
    return res.sendStatus(204);

}
catch(error){
    console.log("error in logout ",error);
    return res.sendStatus(500).json({error:"logout failed"});
}
}

export default logoutHandler;