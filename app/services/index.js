'use strict';

/** ******************************
 **** Managing all the services ***
 ********* independently ********
 ******************************* */
module.exports = {
    authService: require('./authService'),
    dbServices:require("./mongodbService"),
};
