const helpers = require('../helpers');
const { MESSAGES } = require('../utils/constants');

let userController = {}

userController.hello=async (payload) => {
    let result = helpers.createSuccessResponse(MESSAGES.HELLO);
    return result;
}

userController.registerUser = async (payload) => {
    let result = helpers.createSuccessResponse(MESSAGES.OTP_SENT_TO_YOUR_EMAIL)
    throw result;
}

module.exports = userController