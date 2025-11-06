import admin from 'firebase-admin';
import { getMessaging } from "firebase-admin/messaging";
import cron from 'node-cron'
import { convertToCronTime } from '../utilities.js';
import testingDevice from '../models/testingDevices.model.js';
import { updateStatusField,updateSentCount } from '../notificationDbController.js';
import {BetaAnalyticsDataClient} from '@google-analytics/data'
import notificationReceivers from '../models/sentNotificationsReceivers.model.js';
import {getDeviceData} from "../devicesDatabase.js"
import blackListedTokens from "../models/blackListedTokens.js"
import NotificationModel from '../models/notification.model.js';
let serviceAccountPath
 serviceAccountPath= process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
console.log("service account path "+serviceAccountPath)
let app;
if (!serviceAccountPath) {
  // This error indicates the -e flag was missing from the docker run command
  console.error("Configuration Error: FIREBASE_SERVICE_ACCOUNT_PATH is not defined.");
  // Consider logging the entire process.env for debugging if this fails


app= admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  projectId: 'alcoupon-webapp',
});
}

const MAX_BATCH_SIZE = 500;

// Split your tokens array into batches
function chunkArray(tokens, size = MAX_BATCH_SIZE) {
  const chunks = [];
  for (let i = 0; i < tokens.length; i += size) {
    chunks.push(tokens.slice(i, i + size));
  }
  return chunks;
}

const messaging =app && admin.messaging(app);

const analyticsDataClient = new BetaAnalyticsDataClient(); 

const deepLinkGenerator=(openType,nid,pageType,link,linkType)=>{
  console.log("open type "+openType)
  switch (openType){
    case "offer":
      if(nid)return(`alcoupon://discount-codes/${nid}/offer`)
        else return null
      break;
      case "store_offers":
        if(nid)return(`alcoupon://discount-codes/${nid}`)
          else return null
        break;
        case "page":
          if(pageType&&nid)return(`alcoupon://page/${pageType}/${nid}`)
            else return null
          break;
          case "direct_link":
            if(link)return(link)
              else return null
            break;

            case "categories":
            if (nid) return(`alcoupon://category-shops/${nid}`)
            break;

            case "top_coupons":
              return(`alcoupon://special-coupons`)
              break;

            case "stores":
              return(`alcoupon://shops`)
              break;
    
  }

}



const sendTestMessage=async({tokens,title,body,campaign_name,campaign_id,open_type,nid,page_type,link,link_type})=>{
  if (open_type)
    sendMessageWithObject({tokens,title,body,campaign_name,campaign_id,open_type,nid,page_type,link,link_type})
  else
  sendTextMessage({tokens,title,body})
}


const sendTextMessage=async({id,tokens,title,body})=>{
  console.log("sending text message ")
  if (tokens){
  const registrationToken =JSON.parse (tokens);
  // 'e7PwK8iUQ066C3jQRWF43M:APA91bHy_YHxDpxDo-8rYmP_7C1T_hYwJUpxik5GYy-4UssJtmWVHovbjjwBN9ugPluLL_u6Xu_aTaITPGy_t8ugLZJNCEjeyD03EomU13JlQ5tCCZ_-AM4';

const message = {
  "notification":{
      "body":body,
      "title":title
    },

tokens: registrationToken
};




// Send a message to the device corresponding to the provided
// registration token.
messaging?.sendEachForMulticast(message)
.then(async(response) => {


  console.log("response from firebase "+JSON.stringify(response))


//   response from firebase {"responses":[{"success":true,"messageId":"projects/alcoupon-webapp/messages/0:1748715006108013%db201482db201482"}],"successCount":1,"failureCount":0}
// Error sending message: {}
  if (response?.successCount&&response?.successCount>0){
    // update status in database
   !!id && await updateStatusField(id,"completed")
   !!id && await updateSentCount(id , response?.successCount)


    //save fcm messageId in database


  }
if (response?.success==false)
  {!!id && updateStatusField(id,"failed")}
  // Response is a message ID string.
  response.responses.forEach((resp, idx) => {
    if (!resp.success) {
      console.error(`Error for token ${message.tokens[idx]}:`, resp.error);
    }
  })
.catch(error => console.error("Error sending messages:", error));
  return response
})

.catch((error) => {
  console.log('Error sending message:', error);
  return null
});
  }
  else console.log("no tokens in sendTextMessage")
}

const sendMessageWithObject=async({id,tokens,title,body,campaign_name,campaign_id,open_type,nid,page_type,link,link_type})=>{

      const registrationToken =JSON.parse (tokens);
        console.log("send message object called "+typeof(registrationToken) + " " +registrationToken)
const filteredRegistrationTokens = (
  // remove blacklisted tokens that were added last campaign as not available tokens
  await Promise.all(
    registrationToken.map(async (token) => {
      const exists = await blackListedTokens.findOne({ token });
      return exists ? null : token; // return null if blacklisted
    })
  )
).filter(token => token !== null); // remove nulls
  if (filteredRegistrationTokens?.length>0){
      const batches = chunkArray(filteredRegistrationTokens);
for (const batch of batches) {
  
  const deepLink= deepLinkGenerator(open_type,nid,page_type,link,link_type)
  console.log("deep link from generator "+deepLink)
  const message = {
    "notification":{
      "body":body,
      "title":title
    },

    "android": {
      "fcm_options": {
        "analytics_label": campaign_id
      }
    },
    "apns": {
      "fcm_options": {
        "analytics_label": campaign_id 
      }
    },

    "data":{
      "campaign_name":campaign_name ,
      "campaign_id": campaign_id,
        "type":"deep_link",
         "deep_link_url":deepLink
      },
  
  tokens: filteredRegistrationTokens
  };
  console.log("message in fcm "+JSON.stringify(message))
  !!id && updateStatusField(id,"sending")



  const response= await messaging?.sendEachForMulticast(message)
  // .then(async(response) => {
    console.log("response from firebase "+JSON.stringify(response))
    if (response?.responses[0]?.success==true){
      // update status in database
     !!id && await updateStatusField(id,"completed")
     !!id && await updateSentCount(id , response?.successCount)
      //save fcm messageId in database

    }
    
if (response?.success==false)
    {!!id && updateStatusField(id,"failed")}
    // Response is a message ID string.
    response.responses.forEach(async(resp, idx) => {
      if (!resp.success) {
        console.error(`Error for token ${message?.tokens[idx]}:`, JSON.stringify(resp));
        if (resp?.error?.code === "messaging/registration-token-not-registered")
       { blackListedTokens.create({
          token:message?.tokens[idx]
        })}
      }
      else{
        console.log("response in success "+JSON.stringify(resp))
        console.log("token in success "+message?.tokens[idx])
  
      
      const deviceDataArray=await getDeviceData(message?.tokens[idx])
      console.log("device data array "+JSON.stringify(deviceDataArray))
      const deviceData=deviceDataArray[0]
console.log("device data "+JSON.stringify(deviceData))
deviceData&&id?
      await notificationReceivers.create({
        fcmId:resp?.messageId,
        notificationDbId:id,
        notificationId:campaign_id,
        notificationName:campaign_name,
        token:message?.tokens[idx],
        success:resp?.success,
        deviceId:deviceData?.device_id,
        language:deviceData?.language,
        country:deviceData?.country,
        platform:deviceData?.device_type,
        


      })
      :
      console.log("no device data ")
    
    }})
  // .catch(error => console.error("Error sending messages:", error));
    // return response
  }
}
  // .catch((error) => {
  //   console.log('Error sending message:', JSON.stringify(error));
  //   // !! error?.message&& updateStatusField(id,"failed")
    // return null
  }




const schedulePN= ({id,tokens,title,body,time,timezone,campaign_name,campaign_id,os,languages,countries,open_type,nid,page_type,link,link_type})=>{
  console.log("time text "+time)
  // const targetDate = new Date(time); // March 18, 2025, 14:30 (2:30 PM) 2025-03-18T14:30:00
  // console.log("targetDate "+JSON.stringify( targetDate))
  console.log("time zone "+timezone)
  const cronTime = convertToCronTime(time);
  console.log("crone time "+cronTime)
  try{

  cron.schedule(cronTime, () => {
    console.log("called in crone")
  //  sendTestMessage(tokens,title,body);
  if (open_type)
  sendMessageWithObject({id,tokens,title,body,campaign_name,campaign_id,open_type,nid,page_type,link,link_type})
else
sendTextMessage({id,tokens,title,body})
   
  }, {
    scheduled: true,
  
  })
  updateStatusField(id,"scheduled")

}catch(error){
   console.log( "error in schedule message"+error)
  };

}




async function getMessageMetrics(messageId,dimensionsArrayString) {
  console.log("inside get analytics")
  console.log("dimensionsArrayString "+dimensionsArrayString)
  try {
const dimensions=JSON.parse(dimensionsArrayString)
   const dimensionsToGet=[]
   dimensions?.includes("name")&&dimensionsToGet.push({ name: 'customEvent:message_name'})
   dimensions?.includes("platform")&&dimensionsToGet.push({ name: 'platform'})
   dimensions?.includes("messageId")&&dimensionsToGet.push({name:'customEvent:message_id'})
   dimensions?.includes("language")&&dimensionsToGet.push({name:'language'})

dimensionsToGet.push({name:"customEvent:label"})
console.log("dimensionsToGet "+JSON.stringify(dimensionsToGet))



    // async function getMetadata() {
    //   const [metadata] = await analyticsDataClient.getMetadata({
    //     name: 'properties/292926436/metadata', // Replace with your GA4 property ID
    //   });
      
    //   console.log('Available Dimensions:');
    //   metadata.dimensions.forEach(d => console.log(d.apiName));
    
    //   console.log('\nAvailable Metrics:');
    //   metadata.metrics.forEach(m => console.log(m.apiName));
    // }
    
    // await getMetadata();

    const [response] = await analyticsDataClient.runReport({
      property: 'properties/292926436',
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],



      dimensions:  dimensionsToGet,
    metrics: [{ name: 'eventCount' }],


      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: 'eventName',
                stringFilter: {
                  matchType: 'EXACT',
                  value: 'notification_receive'
                }
              }
            },
            // {
            //   filter: {
            //     fieldName: 'customEvent:message_id',
            //     stringFilter: {
            //       matchType: 'EXACT',
            //       value: '3541329043305155611'
            //     }
            //   }
            // }
          ]
        }}
    });

    // console.log('All events in date range:');
    // response.rows.forEach(row => {
    //   console.log(JSON.stringify(row))
    //   console.log(
    //     `Event: ${row.dimensionValues[0].value} | ` +
    //      `Platform: ${row.dimensionValues[1].value} | ` +
    //     `Count: ${row.metricValues[0].value}`
    //   );
    // });
    console.log("response from analytics "+JSON.stringify(response))
    return response;

  } catch (error) {
    console.error('Error getting metrics:', error);
  }
}



const getNotificationAnalyticsFromDb=async (notification_ids,languages,countries,os)=>{
  console.log("notificationIds in analytics function "+notification_ids)
  console.log("languages in analytics function "+languages)
  console.log("countries in analytics function "+countries)
  console.log("os in analytics function "+os)
  const notificationIdsArray=Array.isArray(notification_ids)?notification_ids:JSON.parse(notification_ids)
  const languagesArray=languages? (Array.isArray(languages)?languages:JSON.parse(languages)):null
  const countriesArray=countries? (Array.isArray(countries)?countries:JSON.parse(countries)):null
  const osArray=os? (Array.isArray(os)?os:JSON.parse(os)):null

// const notification=await NotificationModel.findById(notificationId)
// console.log("notification in analytics "+JSON.stringify(notification))
// const receivers = await notificationReceivers.find({notificationDbId:notificationId})
// console.log("receivers in analytics "+JSON.stringify(receivers))
const platformStats = await notificationReceivers.aggregate([
  { $match: { ...(notificationIdsArray?.length ? { notificationDbId: { $in: notificationIdsArray } } : {}),
...(languagesArray?.length ? { language: { $in: languagesArray } } : {}),
...(countriesArray?.length ? { country: { $in: countriesArray } } : {}),
...(osArray?.length ? { platform: { $in: osArray } } : {})}},

  { $group: { _id: "$platform", count: { $sum: 1 } } }
]);

const languageStats = await notificationReceivers.aggregate([
    { $match: 
     { ...(notificationIdsArray?.length ? { notificationDbId: { $in: notificationIdsArray } } : {}),
...(languagesArray?.length ? { language: { $in: languagesArray } } : {}),
...(countriesArray?.length ? { country: { $in: countriesArray } } : {}),
...(osArray?.length ? { platform: { $in: osArray } } : {})}},
  { $group: { _id: "$language", count: { $sum: 1 } } }
]);
const countryStats = await notificationReceivers.aggregate([
  { $match: { ...(notificationIdsArray?.length ? { notificationDbId: { $in: notificationIdsArray } } : {}),
...(languagesArray?.length ? { language: { $in: languagesArray } } : {}),
...(countriesArray?.length ? { country: { $in: countriesArray } } : {}),
...(osArray?.length ? { platform: { $in: osArray } } : {})}},
  { $group: { _id: "$country", count: { $sum: 1 } } }
]);



const tableAnalytics = await notificationReceivers.aggregate([
      { $match: { ...(notificationIdsArray?.length ? { notificationDbId: { $in: notificationIdsArray } } : {}),
...(languagesArray?.length ? { language: { $in: languagesArray } } : {}),
...(countriesArray?.length ? { country: { $in: countriesArray } } : {}),
...(osArray?.length ? { platform: { $in: osArray } } : {})}},
  {
    $group: {
      _id: {
        notificationDbId: "$notificationDbId",
        notificationName:"$notificationName",
        platform: "$platform",
        language: "$language",
        country: "$country"
      },
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      notificationDbId: "$_id.notificationDbId",
      notificationName:"$_id.notificationName",
      platform: "$_id.platform",
      language: "$_id.language",
      country: "$_id.country",
      count: 1
    }
  }
]);

console.log("platform stats "+JSON.stringify(platformStats))
console.log("language stats "+JSON.stringify(languageStats))
console.log("country stats "+JSON.stringify(countryStats))
if (platformStats?.length>0||languageStats?.length>0||countryStats?.length>0) {
  console.log("returning data from analytics")
return {
  result:"success",
  data:{
    platformStats,
    languageStats,
    countryStats,
    tableAnalytics,
  } 
}
} else {
  return {
    result:"error",
    message:"No data found"
  }
}
}

export {sendTestMessage,sendTextMessage,schedulePN,getMessageMetrics,getNotificationAnalyticsFromDb};