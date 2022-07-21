let server = require('./config/server'),
    nconf = require('nconf'),
    async = require('async'),
    logger = require('winston');

//  require('dotenv').load();
// Set up configs
nconf.use('memory');
// First load command line arguments
nconf.argv();
// Load environment variables
//  nconf.env();
// Load config file for the environment
//  require('./config/environments/' + nconf.get('NODE_ENV'));

logger.info('[APP] Starting server initialization');
async.series(
    [
        callback => server(callback)
    ],
    err => {
        if (err) logger.error(`[APP] initialization failed ${err}`);
        else logger.info('[APP] initialized SUCCESSFULLY');
    }
);
