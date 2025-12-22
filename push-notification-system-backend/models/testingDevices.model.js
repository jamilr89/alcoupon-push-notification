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
            required:false,
            index:true
        },
        activatedAt:{
            type:Date,
            required:false,
            index:true
        }
    }
)


const  testingDevice=mongoose.model("TestingDevice",TestingDeviceScheme)
 export default testingDevice