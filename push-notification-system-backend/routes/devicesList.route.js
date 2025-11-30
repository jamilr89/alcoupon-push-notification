import express from "express";
import { getCountriesOptions, getDevicesTokens, getLanguagesOptions, getOSOptions } from "../devicesDatabase.js";
import TestingDevice from "../models/testingDevices.model.js";
import authMiddleWare from "../middlewares/authMiddleWare.js";
import AuthorizeRole from "../middlewares/roleMiddleWare.js";

const devicesRouter=express.Router();

devicesRouter.get("/languages",authMiddleWare,AuthorizeRole("admin","sender","analyst","superAdmin"),async(req,res)=>{
    console.log("in languages route")
     try {
    const languages=await getLanguagesOptions()
   
        return res.status(200).json(languages)
        
    } catch (error) {
        return res.status(500).json({message:"server error"})
    }

})

devicesRouter.get("/countries",authMiddleWare,AuthorizeRole("admin","sender","analyst","superAdmin"),async(req,res)=>{
    console.log("in countries route")
    
    try {
        const countries=await getCountriesOptions()
       if(countries) return res.status(200).json(countries)
        else return res.status(500).json({message:"no countries found"})
        
    } catch (error) {
        return res.status(500).json({message:error?.message})
    }

})

devicesRouter.get("/os",authMiddleWare,AuthorizeRole("admin","sender","analyst","superAdmin"),async(req,res)=>{
    console.log("in os route")
    try {
    const os=await getOSOptions()
        return res.status(200).json(os)
        
    } catch (error) {
        return res.status(500).json({message:error?.message})
    }

})

devicesRouter.get("/tokens",authMiddleWare,AuthorizeRole("admin","sender","superAdmin"),async(req,res)=>{
    console.log("in tokens route")
    const {country,os,language}= req.query;
    console.log ("country "+country+" os "+os+" language "+language)
    if (!!country&&!!os&&!!language){
        try {
    const tokens=await getDevicesTokens(country,language,os)
        return res.status(200).json(tokens)
        
    } catch (error) {
        return res.status(500).json({message:error?.message})
    }}
    return res.status(500).json({message:"query values are missed"})

})


devicesRouter.post("/test_devices",async(req,res)=>{
    console.log("in add testing device route")
    console.log("query params "+JSON.stringify(req.query))  
    const {username,token,device_type}= req.query;
    console.log("username "+username+" token "+token+" device_type "+device_type)
     try {
    if (!!token&&username){
        console.log("creating testing device")
        const result = TestingDevice.create({
            username:username,
            token:token,
            device_type:device_type||undefined,
            status:"inactive"
        })
  
        return res.status(200).json(result)
    }
    } catch (error) {
        return res.status(500).json({message:error?.message})
    }
    return res.status(500).json({message:"query values are missed"})

})

devicesRouter.post("/confirm_device/:id",authMiddleWare,AuthorizeRole("admin","superAdmin"),async(req,res)=>{
    console.log("in confirm testing device route")
    const {id}= req.params;
     try {
    if (id){
        const result = await TestingDevice.findByIdAndUpdate(id,{status:"active"},{new:true})
  console.log("confirm device result "+JSON.stringify(result))
        return res.status(200).json(result)
    }
    } catch (error) {
        return res.status(500).json({message:error?.message})
    }
    return res.status(500).json({message:"query values are missed"})

});


devicesRouter.get("/test_devices",authMiddleWare,AuthorizeRole("admin","sender","analyst","superAdmin"),async(req,res)=>{
    
     try {

        const result =await TestingDevice.find({status:"active"})
  console.log("get testing devices "+JSON.stringify(result))
        return res.status(200).json(result)
    }
    catch (error) {
        return res.status(500).json({message:error?.message})
    }
    return res.status(500).json({message:"query values are missed"})

})

devicesRouter.get("/inactive_test_devices",authMiddleWare,AuthorizeRole("admin","superAdmin"),async(req,res)=>{
    
     try {

        const result =await TestingDevice.find({status:"inactive"})
  console.log("get inactive testing devices "+JSON.stringify(result))
        return res.status(200).json(result)
    }
    catch (error) {
        return res.status(500).json({message:error?.message})
    }
    return res.status(500).json({message:"query values are missed"})

})


devicesRouter.delete("/test_device/:id",authMiddleWare,AuthorizeRole("admin","superAdmin"),async(req,res)=>{
    console.log("in delete testing device route")
    const {id}= req.params;
     try {
    if (id){
        const result = await TestingDevice.findByIdAndDelete(id)
  console.log("delete device result "+JSON.stringify(result))
        return res.status(200).json({message:"device deleted successfully"})
    }
    } catch (error) {
        return res.status(500).json({message:error?.message})
    }
    return res.status(500).json({message:"query values are missed"})

});



export default devicesRouter;

