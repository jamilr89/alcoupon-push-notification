import {Worker } from 'bullmq';
import {redisConfig} from '../config/redis.js';
import { runUserStreaming } from '../producer.js';


const masterWorker = new Worker('fcm-notifications', async (job) => {
  if (job.name === 'trigger-send-notification') {
    console.log("Master Job triggered! Starting user streaming...");
    
    await runUserStreaming(job.data);
  }
}, { connection: redisConfig ,lockDuration: 300000, // Tell LockManager the job can safely take up to 5 minutes
  lockRenewTime: 60000});