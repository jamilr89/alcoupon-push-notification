import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


const logoutHandler = async (req,res)=>{
    try{
const user = await User.updateOne({"sessions.refreshToken":req.cookies?.refreshToken},{ "$set": {
      "sessions.$[session].refreshToken": "",
      // ... other session details to update
    }},
    {
        arrayFilters: [ { "session.refreshToken": req.cookies?.refreshToken } ]
    }
    );
    console.log("user after logout update:",JSON.stringify(user));
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