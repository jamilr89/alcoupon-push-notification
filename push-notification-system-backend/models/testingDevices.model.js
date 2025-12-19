import mongoose from "mongoose";

const TestingDeviceScheme=new mongoose.Schema(
    {
        username:{
            type:String,
            required:[true,"please add username"]
        },
        token:{
            type:String,
            required:[true,"please add token"]
        },
        device_type:{
            type:String,
            required:false
        },
        status:{
            type:String,
            enum:["active","inactive"],
            default:"inactive"
        },
        addedTime:{
            type:Date,
            default:Date.now
        },
        activatedAt:{
            type:Date,
            required:false
        }
    }
)


const  testingDevice=mongoose.model("TestingDevice",TestingDeviceScheme)
 export default testingDevice