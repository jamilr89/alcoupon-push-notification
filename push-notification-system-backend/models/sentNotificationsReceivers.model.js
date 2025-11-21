import mongoose from "mongoose";

const notificationReceiversScheme=new mongoose.Schema(
    {
        fcmId:{
            type:String,
            required:false

        },
        notificationDbId:{
            type:String,
            required:[true,"please add notification db id"]
        },

        notificationId:{
            type:String,
            required:[true,"please add notification Id"]
        },
        notificationName:{
            type:String,
            required:[true,"please add notification name"]
        },
        notificationTime:{
            type:Date,
            required:false
        },
        notificationTimezone:{
            type:String,
            required:false
        },
        token:{
            type:String,
            required:[true,"please add token"]
        },
        deviceId:{
            type:String,
            required:false
        },

        success:{
            type:Boolean,
            required:false
        },
        errorCode:{
            type:String,
            required:false
        },
        errorMessage:{
            type:String,
            required:false
                    },
        language:{
            type:String,
            required:false
        },
        country:{
            type:String,
            required:false
        },
        platform:{
            type:String,
            required:false
        },

    }
)


const  notificationReceivers=mongoose.model("notificationReceivers",notificationReceiversScheme)
 export default notificationReceivers