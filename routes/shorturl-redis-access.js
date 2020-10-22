const shortUrlRedisAccess = {};

const redis = require("redis");

const loggerHandler = require('../utils/logger-handler');
const config = require("../config/config");

const logger = loggerHandler.logger;

const REDIS = config.redis;

const redisConn = require('../utils/redis-conn');

shortUrlRedisAccess.incrementNumber = async()=>{
    let err, result;
    return await redisConn.hincrby(REDIS.key.incr_index, 
        REDIS.key.incr_index, REDIS.value.incr_step);
}

shortUrlRedisAccess.saveShortToOriginUrl = async(shortUrl, originUrl)=>{
    return await redisConn.hset(REDIS.key.short_to_orig, shortUrl, originUrl);
}

shortUrlRedisAccess.getOriginUrl = async(shortUrl)=>{
    return await redisConn.hget(REDIS.key.short_to_orig, shortUrl);
}

shortUrlRedisAccess.getShortUrl = async(originUrl)=>{
    return await redisConn.hget(originUrl, originUrl);
}

shortUrlRedisAccess.setMappingUrlExpire = async(originUrl)=>{
    return await redisConn.expire(originUrl, REDIS.value.expire_time);
}

shortUrlRedisAccess.saveMappingUrl = async(originUrl, shortUrl)=>{
    let values = [
        ["hset", originUrl, originUrl, shortUrl],
        ["expire", originUrl, REDIS.value.expire_time]
    ];
    return await redisConn.multi(values);
}



module.exports = shortUrlRedisAccess;
