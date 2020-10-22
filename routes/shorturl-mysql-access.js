
const shortUrlMysqlAccess = {};

const mysqlConn = require('../utils/mysql-conn.js');


const GET_ORIGIN_FROM_URL_MAPPING_BY_SHORT = 
`
SELECT 
    origin_url
FROM 
    url_mapping
WHERE 1
    AND short_url = ?
`
shortUrlMysqlAccess.getOriginUrl = async (data)=> {
    let params = [data.shortUrl];
    return await mysqlConn.query(GET_ORIGIN_FROM_URL_MAPPING_BY_SHORT, params);
}


let urlMappingInsertColumns = 
[
    "idx         = ?",
    "short_url   = ?",
    "origin_url  = ?"
];
urlMappingInsertColumns = urlMappingInsertColumns.join(',');

const INSERT_URL_MAPPING = 
`
INSERT INTO 
    url_mapping
SET 
    ${urlMappingInsertColumns}
`;

shortUrlMysqlAccess.insertUrlMapping = async(data)=> {
    let err, result;
    let params = [
        data.idx,
        data.shortUrl,
        data.originUrl
    ];
    
    [err, result] = await mysqlConn.query(INSERT_URL_MAPPING, params);

    if(err)return [err, null];
    else return [null, {success:true, data:""}];
}


module.exports = shortUrlMysqlAccess;
