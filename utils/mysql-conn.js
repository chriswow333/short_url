const mysqlConn = {};

const mysql = require('mysql');

const config = require('../config/config.js');

const loggerHandler = require('./logger-handler.js');
const logger = loggerHandler.logger;

mysqlConn.pool = mysql.createPool({
  connectionLimit: config.mysql.connection_limit,
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.username,
  password: config.mysql.password,
  database: config.mysql.database,
  waitForConnections: config.mysql.wait_for_connections,
  queueLimit: config.mysql.queue_limit,
  dateStrings: true
});

mysqlConn.query = (sql, values)=>{
  return new Promise((resolve, reject) => {
    mysqlConn.pool.query(sql, values, (err, results, fields)=> {
      if(err) reject(err);
      else resolve(results);
    });
  }).then((result)=>{
    return [null, result];
  }).catch((err)=>{
      logger.error(err);
    return [err, null];
  });
};

mysqlConn.getConnWithTx = function(){
  return new Promise((resolve,reject)=>{
    mysqlConn.pool.getConnection((err, connection)=> {
      connection.beginTransaction((err)=> {
        if (err) {
          connection.rollback(()=> {
            connection.release();
            reject(err);
          });
        } else {
          resolve(connection);
        }
      });
    });
  }).then(function(result){
    return [null, result];
  }).catch(function(err){
    logger.error(err);
    return [err, null];
  });
};

mysqlConn.queryWithTx = (conn, sql, values)=>{
  return new Promise((resolve, reject)=>{
    conn.query(sql, values, (err, results)=> {
      if (err) {
        conn.rollback(()=> {
          conn.release();
          reject(err);
          });
      } else {
        resolve();
      }
    });
  }).then((result)=>{
    return [null, result];
  }).catch((err)=>{
    logger.error(err);
    return [err, null];
  });
};

mysqlConn.commitWithTx = (conn)=>{
  return new Promise((resolve, reject)=>{
    conn.commit((err)=> {
      if (err) {
        conn.rollback(()=> {
          conn.release();
          reject(err);
        });
      } else {
        conn.release();
        resolve();
      }
    });
  }).then((result)=>{
    return [null, result];
  }).catch((err)=>{
    logger.error(err);
    return [err, null];
  });
};

mysqlConn.rollbackWithTx = (conn)=>{
  return new Promise((resolve, reject)=>{
    conn.rollback(()=> {
      conn.release();
      resolve();
    });
  });
};


module.exports = mysqlConn;