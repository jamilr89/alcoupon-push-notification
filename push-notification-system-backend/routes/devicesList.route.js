import express from "express";
import { getCountriesOptions, getDevicesTokens, getLanguagesOptions, getOSOptions } from "../devicesDatabase.js";
import TestingDevice from "../models/testingDevices.model.js";
import authMiddleWare from "../middlewares/authMiddleWare.js";
import AuthorizeRole from "../middlewares/roleMiddleWare.js";

const devicesRouter=express.Router();

devicesRouter.get("/languages",authMiddleWare,AuthorizeRole("admin","sender","analyst"),async(req,res)=>{
    const languages=await getLanguagesOptions()
    try {
        return res.status(200).json(languages)
        
    } catch (error) {
        return res.status(500).json({message:error?.message})
    }

})

devicesRouter.get("/countries",authMiddleWare,AuthorizeRole("admin","sender","analyst"),async(req,res)=>{
    const countries=await getCountriesOptions()
    try {
        return res.status(200).json(countries)
        
    } catch (error) {
        return res.status(500).json({message:error?.message})
    }

})

devicesRouter.get("/os",authMiddleWare,AuthorizeRole("admin","sender","analyst"),async(req,res)=>{
    const os=await getOSOptions()
    try {
        return res.status(200).json(os)
        
    } catch (error) {
        return res.status(500).json({message:error?.message})
    }

})

devicesRouter.get("/tokens",authMiddleWare,AuthorizeRole("admin","sender"),async(req,res)=>{
    const {country,os,language}= req.query;
    console.log ("country "+country+" os "+os+" language "+language)
    if (!!country&&!!os&&!!language){
    const tokens=await getDevicesTokens(country,language,os)
    try {
        return res.status(200).json(tokens)
        
    } catch (error) {
        return res.status(500).json({message:error?.message})
    }}
    return res.status(500).json({message:"query values are missed"})

})


devicesRouter.post("/test_devices",async(req,res)=>{
    const {username,token,device_type}= req.query;
     try {
    if (!!token&&username){
        const result = TestingDevice.create({
            username:username,
            token:token,
            device_type:device_type||undefined
        })
  
        return res.status(200).json(result)
    }
    } catch (error) {
        return res.status(500).json({message:error?.message})
    }
    return res.status(500).json({message:"query values are missed"})

})


devicesRouter.get("/test_devices",authMiddleWare,AuthorizeRole("admin","sender","analyst"),async(req,res)=>{
    
     try {

        const result =await TestingDevice.find({})
  console.log("get testing devices "+JSON.stringify(result))
        return res.status(200).json(result)
    }
    catch (error) {
        return res.status(500).json({message:error?.message})
    }
    return res.status(500).json({message:"query values are missed"})

})



export default devicesRouter;

