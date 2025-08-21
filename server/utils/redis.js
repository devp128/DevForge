const { createClient } = require('redis');
require('dotenv').config();
let redisClient = null;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    await redisClient.connect();
    console.log('Redis Client Connected');
  }
  return redisClient;
}

exports.setSessionCache = async (sessionId, messages) => {
  try {
    const client = await getRedisClient();
    await client.set(`session:${sessionId}`, JSON.stringify(messages), { EX: 3600 });
  } catch (error) {
    console.error('Redis set error:', error);
  }
};

exports.getSessionCache = async (sessionId) => {
  try {
    const client = await getRedisClient();
    const data = await client.get(`session:${sessionId}`);
     //console.log(JSON.parse(data));
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};