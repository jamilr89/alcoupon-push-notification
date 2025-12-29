import { Queue } from 'bullmq';
import {redisConfig} from '../config/redis.js';
console.log("Redis Config in notification queue:", redisConfig);
const notificationQueue = new Queue('fcm-notifications', { 
  connection: redisConfig 
});
console.log("Notification Queue created:", JSON.stringify(notificationQueue));

export default notificationQueue;