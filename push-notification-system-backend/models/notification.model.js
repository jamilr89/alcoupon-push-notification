import mongoose from 'mongoose'



const NotificationsSchema= mongoose.Schema(
    {
       
        title :{
            type : String,
            required:[true,"please enter title"]
            
        },
        text:{
            type:String,
            required:[true,"please enter text"]
        },
        campaign_name:{
            type:String,
            required:[true,"please add campaign name"]
        },
        campaign_id:{ type:String,
        required:[true,"please add campaign id"]
        },
        fcmMessageId:{
            type:String,
            required:[false]
        },
        status:{
            type:String,
            enum: ['scheduled','sending', 'completed','canceled','failed'],
            required:[false]
        },

        sent_count:{
            type:Number,
            required:[false]
        },
        operating_system:{
            type :Array,
            required:[true,"please choose OS"]
        },
        languages:{
            type :Array,
            required:[true,"please choose language"]
        },
        countries:{
            type:Array,
            required:[true,"please choose countries"]
        },

        time:{
            type:String,
            required:[true,"time is required"]
        },
        timezone:{
            type:String,
            required:[true,"timezone is required"]
        },
        open_type:{
            type:String,
            required:[false]

        },
        nid:{
            type:String,
            required:[false]
        },
        page_type:{
            type:String,
            required:[false]
        },
        link:{
            type:String,
            required:[false]
        },
        link_type:{
            type:String,
            required:[false]
        }


    }
)

 const  NotificationModel=mongoose.model("Notification",NotificationsSchema)
 export default NotificationModel