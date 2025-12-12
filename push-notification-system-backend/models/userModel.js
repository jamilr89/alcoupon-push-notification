import mongoose, { trusted } from "mongoose";
import { sessionSchema } from "./sessionModel.js";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    roles :{
        type:[String],
        required:true,
        enum:["superAdmin","admin","user","analyst","sender"]
    },
    password:{
        type:String,
        required:true
    },
    sessions:{
        type:[sessionSchema],
        required:true,
        default:[]
    // refreshToken:{type: String,required:false}
}},{timestamps:true}

)
// This creates the multi-key index on the nested field 'sessions.refreshToken'
// It ensures that no two sessions in the entire collection share the same token.
userSchema.index({ 'sessions.refreshToken': 1 }, { unique: true });

export default mongoose.model("User",userSchema);