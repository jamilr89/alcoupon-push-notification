import notificationQueue from './queues/notification.js';
import User from './models/userModel.js';
import { redis } from './config/redis.js';
import { updateStatusField } from './controllers/notificationDbController.js';

/**
 * STEP 1: The "Scheduler"
 * Called by your API to put the "Start Signal" into Redis
 */
async function scheduleGlobalBlast(payload) {
    const  { time } = payload;
    const timestamp = new Date(time).getTime();
  const jobId = `master-blast-${timestamp}`;
   console.log("Scheduling global blast at "+time)
   console.log("With payload "+JSON.stringify(payload))
   console.log("delay "+(new Date(time) - Date.now()))
   console.log("jobId "+jobId)

  const result = await notificationQueue.add('trigger-send-notification', payload, {
   
    delay: new Date(time) - Date.now(),
    jobId: jobId,
    removeOnComplete: true,
  });
  console.log(`Scheduled global blast with job ${JSON.stringify(result)}`);
const jobs = await notificationQueue.getJobs(
  ['waiting', 'delayed', 'active', 'completed', 'failed', 'paused'],
  0,      // start
  -1      // end (-1 = get all)
);

jobs.forEach(job => {
  console.log("job info: ")
  console.log({
    id: job.id,
    name: job.name,
    data: job.data,
    scheduledFor: job.timestamp + job.delay ? new Date(job.timestamp + job.delay) : null,
    attemptsMade: job.attemptsMade,
  });
});
  return jobId;
}


async function cancelScheduledBlast(jobId) {
  const job = await notificationQueue.getJob(jobId);
  if (job && (await job.getState()) === 'delayed') {
    await job.remove();
    updateStatusField(job.data.id, 'cancelled');
    return true;
  }
  return false;
}

async function stopScheduledBlast(jobId) {
   await redis.set('fcm_kill_switch', 'true', 'EX', 3600); // 1-hour expiry
   return true;
}
/**
 * STEP 2: The "Batcher" (The actual Producer logic)
 * This runs ONLY when the scheduled time is reached.
 */
async function runUserStreaming(payload) {
  const BATCH_SIZE = 1000;
  let batchCounter = 0;
  let currentBatch = [];
  const {id,tokens,title,body,time,timezone,campaign_name,campaign_id,os,languages,countries,open_type,nid,page_type,link,link_type}=payload;


 const cursor = User.aggregate([
  { $match: { languages: { $in: languages }, countries: { $in: countries }, os: { $in: os } } },
  {
    $lookup: {
      from: 'blacklists', // name of the blacklist collection
      localField: 'fcmToken',
      foreignField: 'token',
      as: 'blacklisted'
    }
  },
  { $match: { blacklisted: { $size: 0 } } }, // Only keep users not found in blacklist
  { $project: { fcmToken: 1 } }
]).cursor();

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    currentBatch.push(doc.fcmToken);
console.log("current batch size "+currentBatch.length)
    if (currentBatch.length === BATCH_SIZE) {
      await notificationQueue.add('send-batch', {
        tokens: currentBatch,
      messagePayload: payload,
      batchId: batchCounter
      }, {
        // Only retry if the WHOLE batch fails
        attempts: 5,
        backoff: { type: 'exponential', delay: 5000 }
      });

      batchCounter++;
      currentBatch = []; // Clear RAM
      updateStatusField(payload.id, 'sending');
    }
  }




  // Final batch for the remaining users
  if (currentBatch.length > 0) {
    await notificationQueue.add('send-batch', {
      tokens: currentBatch,
      messagePayload: payload,
      batchId: batchCounter
    });
  }

  updateStatusField(payload.id, 'completed');
  
  console.log(`Streaming finished. Created ${batchCounter + 1} batches.`);
}

export { scheduleGlobalBlast, runUserStreaming ,cancelScheduledBlast,stopScheduledBlast};