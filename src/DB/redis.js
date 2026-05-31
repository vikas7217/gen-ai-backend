const redis = require('redis');
const host = process.env.REDIS_HOST || '127.0.0.1';
const port = process.env.REDIS_PORT || 6379;
const provider = process.env.REDIS_PROVIDER || 'redis';

async function connectRedis(){

    try{
        const client = await redis.createClient({
            url: `${provider}://${host}:${port}`
        })
        .on('error', (error)=>{console.error('Redis connection error:',error)})
        .connect().then(()=> console.info('✅ Redis Connected successfully'));

        global.client = client;

    }catch(error){
        console.error('Error connecting to Redis:', error);
    }
}
module.exports = connectRedis;