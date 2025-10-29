import mongoose from "mongoose";

const blackListedTokensScheme=new mongoose.Schema(
    {
        token:{
            type:String,
            required:false

        },
    });


    const  blackListedTokens=mongoose.model("blackListedTokens",blackListedTokensScheme)
     export default blackListedTokens;