/* eslint-disable no-console */

'use strict';

/** *********************************
**** node module defined here *****
********************************** */
require('dotenv').config();
const http = require('http');
const process = require('process');
const EXPRESS = require('express');
const { SERVER } = require('./config');
const socketIo = require("socket.io");
const mongoose = require('mongoose');
const { PORT } = require('./config/config');
const setUpSocket = require('./socket/socket');

/** creating express server app for server. */
const app = EXPRESS();


/** ******************************
***** Server Configuration *****
******************************* */
const server = http.Server(app);
const io = socketIo(server, { cors: { origin: '*' } });

/** Server is running here */
const startNodeserver = async () => {
    await require('./app/startup/mongodbStartup')(mongoose);
    await require('./app/startup/expressStartup')(app); 
    await setUpSocket(io);
    return new Promise((resolve, reject) => {
        server.listen(PORT, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

startNodeserver().then(() => {
    console.log(`'Node server running on', http://localhost:${PORT}`);
}).catch((err) => {
    console.log('Error in starting server', err);
    process.exit(1);
});
