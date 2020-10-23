# README #

version 1.0
Date:  2020/10/23

###  Title ###
    Short url api

###  Directory  ###
    [Short url Archive]
        |- app.js                   # entry point.
        |- routes/                  
            |- *-router.js          # end point
            |- *-service.js         # process data from *-router.js
            |- *-mysql-access.js    # access mysql.  
            |- *-redis-access.js    # access redis.  
        |- utils/                  
            |- mysql-conn.js        # mysql library.
            |- redis-conn.js        # redis library.  
            |- logger-handler.js    # logger library.
            |- init.js              # Execute before express start running.


###  STEPS ###

    [STEP 1] Using "npm install" command to install node_modules.
    [STEP 2] Using "node app" command to start short url api. or using "pm2" to start.