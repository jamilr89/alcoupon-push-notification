import mongoose from "mongoose";

const BlackListedTokensScheme=new mongoose.Schema(
    {
        token:{
            type:String,
            required:false

        },
    });


    const  BlackListedTokens=mongoose.model("blackListedTokens",BlackListedTokensScheme)
     export default BlackListedTokens;