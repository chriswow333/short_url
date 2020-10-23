const redisConn = {};


const redis = require("redis");

const loggerHandler = require('./logger-handler');
const config = require("../config/config");

const REDIS = config.redis;
const logger = loggerHandler.logger;

let client = null;


redisConn.init = function(){
    client = redis.createClient({
        host: REDIS.host,
        port: REDIS.port
    });

    client.on('error', function(err){ 
        logger.error(err);
    });
}

redisConn.quit = function(){
    client.quit();
}


redisConn.hget = (key, field)=>{
    return new Promise((resolve, reject)=>{
        client.hget(key, field, (err, reply)=> {
            if(err) reject(err);
            else resolve(reply);
        });
    }).then((reply)=>{
        return [null, reply];
    }).catch((err)=>{
        logger.error(err);
        return[err, null];
    });
}


redisConn.hset = (key, field, value)=>{
    return new Promise((resolve, reject)=>{
        client.hset(key, field, value, (err, reply)=> {
            if(err) reject(err);
            else resolve(reply);
        });
    }).then((reply)=>{
        return [null, reply];
    }).catch((err)=>{
        logger.error(err);
        return[err, null];
    });
}


redisConn.set = (key, value)=>{
    return new Promise((resolve, reject)=>{
        client.set(key, value, (err, reply)=> {
            if(err) reject(err);
            else resolve(reply);
        });
    }).then((reply)=>{
        return [null, reply];
    }).catch((err)=>{
        logger.error(err);
        return[err, null];
    });
}

redisConn.expire = (key, seconds)=>{
    return new Promise((resolve, reject)=>{
        client.expire(key, seconds, (err, reply)=>{
            if(err) reject(err);
            else resolve(reply);
        });
    }).then((reply)=>{
        return [null, reply];
    }).catch((err)=>{
        logger.error(err);
        return[err, null];
    });
}


redisConn.hincrby = (key, field, increment)=>{
    return new Promise((resolve, reject) => {
        client.hincrby(key, field, increment, (err, reply) => {
            if(err) reject(err);
            else resolve(reply);
        });
    }).then((reply)=>{
        return [null, reply];
    }).catch((err)=>{
        return[err, null];
    });
}

redisConn.incr = (key)=>{
    return new Promise((resolve, reject) => {
        client.incr(key, (err, reply) => {
            if(err) reject(err);
            else resolve(reply);
        });
    }).then((reply)=>{
        return [null, reply];
    }).catch((err)=>{
        return[err, null];
    });
}

redisConn.multi = (values)=>{
    return new Promise((resolve, reject)=>{
        client.multi(values).exec(function(err, replies) {
            if(err) reject(err);
            else resolve(replies);
        });
    }).then((replies)=>{
        return [null, replies];
    }).catch((err)=>{
        logger.error(err);
        return[err, null];
    });
}



module.exports = redisConn;
