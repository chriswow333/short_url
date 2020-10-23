const init = {};

const redisConn = require('./redis-conn');
const mysqlConn = require('./mysql-conn');
const config = require('../config/config');

const REDIS = config.redis;

const GET_LAST_INDEX = 
`
SELECT 
    idx
FROM 
    url_mapping
ORDER BY 
   idx  DESC
LIMIT 1
`;

init.init = async()=>{

    redisConn.init();
    
    let err, result, index;
    [err, result] = await mysqlConn.query(GET_LAST_INDEX, null);
    if(err) throw err;
    
    if(result.length === 0){
        index = REDIS.value.init_index;
    }else{
        index = result[0].idx;
    }
    
    for(let i = 0; i < REDIS.value.incr_step; ++i) {
        if(index % REDIS.value.incr_step === REDIS.value.init_index)break;
        else ++index;
    }

    [err, result] = await redisConn.hset(REDIS.key.incr_index, REDIS.key.incr_index, index);
    if(err)throw err;
};

module.exports = init;
