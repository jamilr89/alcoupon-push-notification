import { Queue } from 'bullmq';
import {redisConfig} from '../config/redis.js';
console.log("Redis Config in notification queue:", redisConfig);
const notificationQueue = new Queue('fcm-notifications', { 
  connection: redisConfig 
});
console.log("Notification Queue created:", JSON.stringify(notificationQueue));
const job = await notificationQueue.getJob(notificationQueue?.data?.id);
console.log("Job retrieved:", job);
// console.log(await job.getState()); // 'delayed' | 'waiting' | 'active' | 'completed' | 'failed' | null
// console.log('Scheduled for:', new Date(job.timestamp + job.delay));

export default notificationQueue;