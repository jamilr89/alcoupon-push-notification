import mongoose, { trusted } from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    roles :{
        type:[String],
        required:true,
        enum:["admin","user","analyst","sender"]
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{type: String,required:false}
},{timestamps:true}

)

export default mongoose.model("User",userSchema);