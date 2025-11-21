import express from 'express'
import NotificationModel from '../models/notification.model.js';
import {schedulePN, sendTestMessage,getNotificationAnalyticsFromDb } from '../controllers/handleFCM.js'
import authMiddleWare from '../middlewares/authMiddleWare.js';
import AuthorizeRole from '../middlewares/roleMiddleWare.js';


const notificationRouter =express.Router();
console.log("in notification route")
notificationRouter.get('/get_analytics',authMiddleWare,AuthorizeRole("admin","analyst"),async (req,res)=>{
    console.log("in get analytics")
    //  console.log("req in analytics "+JSON.stringify(req))
    try {
        
        const {notification_ids,languages,countries,os}=req.query
         console.log("notification_id",notification_ids)
         console.log("languages",languages)
            console.log("countries",countries)
            console.log("os",os)
        // const response = await getMessageMetrics(notification_id,dimensions)
        return res.status(200).json(await getNotificationAnalyticsFromDb(notification_ids,languages,countries,os))
        // console.log("response in notification router "+JSON.stringify(response))
        // return res.status(200).json({status:"success",data:response})
    }
catch(error){

    console.log("notification analytics error"+error)
    return res.status(500).json({message:error?.message})
}})
notificationRouter.get('/test',authMiddleWare,AuthorizeRole("admin","sender","superAdmin"),async(req,res)=>{
    try {
        const {tokens,body,title,campaign_name,campaign_id,open_type,nid,page_type,link,link_type}=req.query;
        const response=await sendTestMessage({tokens,title,body,campaign_name,campaign_id,open_type,nid,page_type,link,link_type})
        return res.status(200).json({status:"success",message:response})
    } catch (error) {
        console.log("test error "+error)
        return res.status(500).json({error:error})
        
    }
})

    notificationRouter.get('/send_pn',authMiddleWare,AuthorizeRole("admin","sender","superAdmin"),async (req,res)=>{
        try {
            const {tokens,body,title,campaign_name,campaign_id,time,timezone,os,languages,countries,open_type,nid,page_type,link,link_type}=req.query;
            console.log("operating system "+JSON.stringify(os))
            const doc=await NotificationModel.create({
                title :title,
                text:body,
                campaign_name:campaign_name,
                campaign_id:campaign_id,
                operating_system:JSON.parse(os),
                languages:languages,
                countries:JSON.parse(countries),
                time:time,
                timezone:timezone,
                open_type:open_type,
                nid:nid,
                page_type:page_type,
                link:link,
                link_type:link_type
            })
           
            const response= schedulePN ({id:doc?._id,tokens,title,body,time,timezone,campaign_name,campaign_id,os,languages,countries,open_type,nid,page_type,link,link_type})
            
         
            return res.status(200).json({status:"success",message:response})
        } catch (error) {
            console.log("send_pn error "+error)
            return res.status(500).json({error:error})
            
        }
     })

notificationRouter.get('/',authMiddleWare,AuthorizeRole("admin","user","superAdmin"),async(req,res)=>{
    try{
        console.log("in notifications")
        const notifications= await NotificationModel.find({}).sort({time:-1})
        res.status(200).json(notifications)


    }
    catch(error){
        res.status(500).json({message:error?.message})

    }
})
notificationRouter.get('/:id',authMiddleWare,AuthorizeRole("admin","user","superAdmin"),async(req,res)=>{
    try{
        const {id}= req.params;
        const notification= await NotificationModel.findById(id)
        res.status(200).json(notification)


    }
    catch(error){
        res.status(500).json({message:error?.message})

    }
})

notificationRouter.post('/',authMiddleWare,AuthorizeRole("admin","user","superAdmin"),async(req,res)=>{
    try{
     const notification=await NotificationModel.create(req?.body);
     res.status(200).json(notification)
    }catch(err){
     res.status(500).json({message:err?.message})
    }
 })





 notificationRouter.put ('/:id',authMiddleWare,AuthorizeRole("admin","sender","superAdmin"),async(req,res)=>{
     try {
         const {id}=req.params;
         const notification=await NotificationModel.findByIdAndUpdate(id,req.body)
         if (!notification){
             return res.status(404).json({message:"notification not found"})
         }
         const updatedNotification = await NotificationModel.findById(id)
         return res.status(200).json(updatedNotification)
     } catch (error) {
         return res.status(500).json({message:error.message})
     }
 })

 notificationRouter.delete('/:id',authMiddleWare,AuthorizeRole("admin","sender","superAdmin"),async(req,res)=>{

     try {
         const {id}=req.params;
         const notification= await NotificationModel.findByIdAndDelete(id)
         if (!notification){
             return res.status(404).json({message:"notification not found"})
         }
         return res.status(200).json({message:"notification deleted successfully"})

         
     } catch (error) {
        return res.status(500).json({message:error?.message})
         
     }

 })




 export default notificationRouter
