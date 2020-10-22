
const shortUrlService = {};

const mysqlConn = require('../utils/mysql-conn.js');
const loggerHandler = require('../utils/logger-handler');

const shortUrlRedisAccess = require('./shorturl-redis-access.js');
const shortUrlMysqlAccess = require('./shorturl-mysql-access.js');

const config = require("../config/config");

const logger = loggerHandler.logger;

shortUrlService.generateShortUrl = async(originUrl)=>{
    let err, result, data, counter, shortUrl;
    try{

        [err, result] = await shortUrlRedisAccess.getShortUrl(originUrl);
        if(err)throw err;
        if(result){
            await shortUrlRedisAccess.setMappingUrlExpire(originUrl);
            return result;
        }

        [err, result] = await shortUrlRedisAccess.incrementNumber();
        if(err)throw err;
        
        counter = result;
        shortUrl = fromDecimalToHex(counter);
        
        data = {
            idx:counter,
            shortUrl:shortUrl,
            originUrl:originUrl
        };

        Promise.all([
            shortUrlMysqlAccess.insertMappingUrl(data),
            shortUrlRedisAccess.saveMappingUrl(originUrl, shortUrl)
        ]);

        return shortUrl;
    }catch(err) {
        logger.error(err);
        return null;
    }
}


const KEY = config.key;
const CARRYING = KEY.length;
const fromDecimalToHex = (counter)=>{
    let shortUrl = "";
    while(counter > 0) {
        let index = counter % CARRYING;
        shortUrl = KEY[index] + shortUrl;
        counter = (counter - index) / CARRYING;
    }
    return shortUrl;
}

shortUrlService.getOriginUrl = async (shortUrl)=>{
    let err, result, originUrl;
    try{
        [err, result] = await shortUrlRedisAccess.getOriginUrl(shortUrl);
        if(err) throw err;
        if(result){
            originUrl = result;
        }else {
            let data = {
                shortUrl:shortUrl
            };
            [err, result] = await shortUrlMysqlAccess.getOriginUrl(data);
            if(err) throw err;
            if(result.length !== 1){
                return null;
            }
            originUrl = result[0].origin_url;
        }

        shortUrlRedisAccess.saveShortToOriginUrl(shortUrl, originUrl);
        return originUrl
    }catch(err) {
        logger.error(err);
        return null;
    }
}

module.exports = shortUrlService;