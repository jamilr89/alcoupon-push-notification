import { Worker } from 'bullmq';
import { sendMessageWithObject } from '../controllers/handleFCM.js';
import { redis,redisConfig } from '../config/redis.js';
import { updateStatusField } from '../controllers/notificationDbController.js';

import blackListedTokens from "../models/blackListedTokens.js"
import notificationReceivers from '../models/sentNotificationsReceivers.model.js';
import {getDeviceData} from "../devicesDatabase.js"
import mongoose from 'mongoose';


const worker = new Worker('fcm-send-batch', async (job) => {
 const mongooseConnectionInWorker = await mongoose.connect('mongodb://mongo:27017/notification-system-db')
console.log('mongooseConnectionInWorker: ' + mongooseConnectionInWorker.connection.readyState);



  // if (job.name !== 'send-batch') {console.log("Job is not of type 'send-batch'"); return};
console.log("Job data: ", JSON.stringify(job.data));
  // 1. CHECK KILL SWITCH
  const isKilled = await redis.get('fcm_kill_switch');
  if (isKilled === 'true') {
    console.log("Kill switch active. Aborting batch.");
    updateStatusField(job.data.messagePayload.id, 'aborted');
    return; // Finish job without sending
  }
console.log("job data in fcmWorker.js "+JSON.stringify(job))
  // const { tokens, messagePayload } = job.data;
  const {open_type,nid,page_type,link,link_type,title,body,campaign_name,campaign_id,id,tokens} = job.data;

  try {
  const response = await sendMessageWithObject({id,tokens,title,body,campaign_name,campaign_id,open_type,nid,page_type,link,link_type})
   response.allResponses?.forEach(async(resp, idx) => {
      if (!resp.success) {
        console.error(`Error for token ${response?.allTokens[idx]}:`, JSON.stringify(resp));
       const error = resp.error.code;
    if (error === 'messaging/registration-token-not-registered' || 
        error === 'messaging/invalid-registration-token') 
       { blackListedTokens.create({
          token:response?.allTokens[idx]
        })}
      }

    

    
      else{
        console.log("response in success "+JSON.stringify(resp))
        console.log("token in success "+response?.allTokens[idx])
  
      
      const deviceDataArray=await getDeviceData(response?.allTokens[idx])
      console.log("device data array "+JSON.stringify(deviceDataArray))
      const deviceData=deviceDataArray[0]
console.log("device data "+JSON.stringify(deviceData))
deviceData&&id?
      await notificationReceivers.create({
        fcmId:resp?.messageId,
        notificationDbId:id,
        notificationId:campaign_id,
        notificationName:campaign_name,
        notificationTime:time,
        notificationTimezone:timezone,
        token:response?.allTokens[idx],
        success:resp?.success,
        deviceId:deviceData?.device_id,
        language:deviceData?.language,
        country:deviceData?.country,
        platform:deviceData?.device_type,
        


      }):
        console.log("no device data ")
    
    }})
    return { success: response };
  } catch (error) {
    throw error; // Retry only if total failure
  }
}, { connection: redisConfig, concurrency: 10 ,lockDuration: 300000, // Tell LockManager the job can safely take up to 5 minutes
  lockRenewTime: 60000});

  worker.on('failed', (job, err) => console.error(`Job ${job.id} failed:`, err));
worker.on('error', (err) => console.error('Worker error:', err));