import jwt from "jsonwebtoken";

const authMiddleWare =(req,res,next)=>{
    try{
        let token;
        let authHeader= req?.headers?.Authorization || req?.headers?.authorization
        console.log("authHeader",authHeader)
        if (authHeader && authHeader.startsWith("Bearer")){
            token=authHeader.split(" ")[1]

            if (!token){
                return res.status (401).json({message:"no token,authorization denied"})
            }
            try {
const decoded = jwt.verify(token,process.env.JWT_ACCESS_SECRET);
req.user=decoded;
console.log("decoded user",req.user)
next();
            } catch (error) {
                return res.status(401).json({message:"Token is not valid"})
            }

        }
        else  return res.status(401).json({message:"Unauthorized"})

    }catch (error){
        return res.status(401).json({message:"Unauthorized"})
    }

}

export default authMiddleWare;