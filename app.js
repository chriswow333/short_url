"use strict"
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');

const config = require('./config/config');
const shortUrlRouter = require('./routes/shorturl-router');
const mysqlConn = require('./utils/mysql-conn');
const loggerHandler = require('./utils/logger-handler.js');

const logger = loggerHandler.logger;

const init = require('./utils/init');
init.init().then(()=>{

    const app = express();
    app.use(helmet());
    app.disable('x-powered-by');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(compression());

    app.use(shortUrlRouter);

    app.use(function (req,res,next){
        res.status(404).send('Unable to find the requested resource!');
    });

    app.use(function (err, req, res, next) {
        logger.error(err);
        res.status(500).send('System is under maintenance.')
    });

    process.on('SIGINT', function() {
        mysqlConn.pool.end(function(err) {
            process.exit(err ? 1 : 0);
        });
    });

    app.listen(config.port);

}).catch((err)=>{logger.error(err)});
