/* eslint-disable no-console */

'use strict';

const fs = require('fs');
const BCRYPT = require('bcrypt');
const JWT = require('jsonwebtoken');
const handlebars = require('handlebars');
const CONSTANTS = require('./constants');
const CONFIG = require(`../../config`);

const commonFunctions = {};

/**
 * incrypt password in case user login implementation
 * @param {*} payloadString
 */
commonFunctions.hashPassword = (payloadString) => BCRYPT.hashSync(payloadString, CONSTANTS.SECURITY.BCRYPT_SALT);

/**
 * @param {string} plainText
 * @param {string} hash
 */
commonFunctions.compareHash = (payloadPassword, userPassword) => BCRYPT.compareSync(payloadPassword, userPassword);

/**
 * function to get array of key-values by using key name of the object.
 */
commonFunctions.getEnumArray = (obj) => Object.keys(obj).map((key) => obj[key]);

/**
 * create jsonwebtoken
 */
commonFunctions.encryptJwt = (payload, expTime = '365d') => JWT.sign(payload, CONSTANTS.SECURITY.JWT_SIGN_KEY, { algorithm: 'HS256' }, { expTime: expTime });

/**
 * decrypt jsonwebtoken
 */
commonFunctions.decryptJwt = (token) => JWT.verify(token, CONSTANTS.SECURITY.JWT_SIGN_KEY, { algorithm: 'HS256' });

/**
 * function to convert an error into a readable form.
 * @param {} error
 */
commonFunctions.convertErrorIntoReadableForm = (error) => {
    let errorMessage = '';
    if (error.message.indexOf('[') > -1) {
        errorMessage = error.message.substr(error.message.indexOf('['));
    } else {
        errorMessage = error.message;
    }
    errorMessage = errorMessage.replace(/"/g, '');
    errorMessage = errorMessage.replace('[', '');
    errorMessage = errorMessage.replace(']', '');
    error.message = errorMessage;
    return error;
};

/**
 * Logger for error and success
 */
commonFunctions.log = {
    info: (data) => {
        console.log(`\x1b[33m${data}`, '\x1b[0m');
    },
    success: (data) => {
        console.log(`\x1b[32m${data}`, '\x1b[0m');
    },
    error: (data) => {
        console.log(`\x1b[31m${data}`, '\x1b[0m');
    },
    default: (data) => {
        console.log(data, '\x1b[0m');
    },
};

/**
 * Send an email to perticular user mail
 * @param {*} email email address
 * @param {*} subject  subject
 * @param {*} content content
 * @param {*} cb callback
 */

commonFunctions.sendEmail = async (userData, type) => {
    const HANDLEBARS = require('handlebars');

    /* setup email data */
    userData.baseURL = CONFIG.SERVER_URL;
    const mailData = commonFunctions.emailTypes(userData, type);
    mailData.template = fs.readFileSync(mailData.template, 'utf-8');
    let template = HANDLEBARS.compile(mailData.template);
    let result = template(mailData.data);

    return await commonFunctions.sendEmailViaAWS(userData, mailData.Subject, result)

};

/**
 * function to create template
 */
commonFunctions.emailTypes = (user, type) => {
    const EmailStatus = {
        Subject: '',
        data: {},
        template: '',
    };
    switch (type) {
        case CONSTANTS.EMAIL_TYPES.FORGOT_PASSWORD_EMAIL:
            EmailStatus["Subject"] = CONSTANTS.EMAIL_SUBJECTS.RESET_PASSWORD_EMAIL;;
            EmailStatus.template = CONSTANTS.EMAIL_CONTENTS.RESET_PASSWORD_TEMPLATE;
            EmailStatus.data["name"] = user.userName;
            EmailStatus.data["link"] = user.resetPasswordLink;
            EmailStatus.data["baseURL"] = user.baseURL;
            break;
        default:
            EmailStatus.Subject = 'Welcome Email!';
            break;
    }
    return EmailStatus;
};

/**
 * function to make email template dynamic.
 */
commonFunctions.renderTemplate = (template, data) => handlebars.compile(template)(data);

/**
 * function to create reset password link.
 */
commonFunctions.createResetPasswordLink = (userData) => {
    const dataForJWT = { ...userData, Date: Date.now };
    let resetPasswordLink = CONFIG.WEB_ADMIN_URL + '/auth/reset-password/' + commonFunctions.encryptJwt(dataForJWT, '1h');
    return resetPasswordLink;
};

/**
 * function to generate random otp string
 */
commonFunctions.generateOTP = (length) => {
    const chracters = '0123456789';
    let randomString = '';
    for (let i = length; i > 0; --i) { randomString += chracters[Math.floor(Math.random() * chracters.length)]; }

    return randomString;
};

/**
 * function to returns a random number between min and max (both included)
 */
commonFunctions.getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Function to generate expiry time in seconds
 */
commonFunctions.generateExpiryTime = (seconds) => new Date(new Date().setSeconds(new Date().getSeconds() + seconds));

/**
 * function to convert seconds in HMS string
 */
commonFunctions.convertSecondsToHMS = (value) => {
    const sec = parseInt(value, 10);
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec - (hours * 3600)) / 60);
    const seconds = sec - (hours * 3600) - (minutes * 60);
    let str = '';
    if (hours) str = str + hours + (hours > 1 ? ' Hours' : ' Hour');
    if (minutes) str = `${str} ${minutes}${minutes > 1 ? ' Minutes' : ' Minute'}`;
    if (seconds) str = `${str} ${seconds}${seconds > 1 ? ' Seconds' : ' Second'}`;

    return str.trim();
};


/**
* function to add time
*/
commonFunctions.addMinutesToDate = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
}

commonFunctions.generateReferralCode = () => {
    let code = '';
    // without zero or 'O'  
    let characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < CONSTANTS.REFERRAL_CODE_LENGTH; i++) {
        code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return code;
}

module.exports = commonFunctions;
