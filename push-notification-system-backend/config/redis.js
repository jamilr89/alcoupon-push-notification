import IORedis from 'ioredis';

// This is the connection object both the Producer and Worker will use
const redisConfig = {
  host:'redis',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD, // This is your managed password
  maxRetriesPerRequest: null, // Required by BullMQ
};
console.log("Redis Config: ", redisConfig);
const redis = new IORedis(redisConfig);

export {redis,redisConfig };