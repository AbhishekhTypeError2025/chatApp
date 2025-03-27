const helpers = require('../helpers');
const userModel = require('../models/userModel');
const { findUser, updateUser } = require('../services/mongodbService');
const { MESSAGES } = require('../utils/constants');
const commonFunctions = require('../utils/utils');

let userController = {}

userController.chat=async (payload) => {
    let result = helpers.createSuccessResponse(MESSAGES.HELLO);
    return result;
}

userController.registerUser = async (payload) => {
    const user = await findUser(userModel, { email: payload.email });

    if (user && !user.isDeleted) {
        throw helpers.createErrorResponse(MESSAGES.USER_ALREADY_EXISTS,"ALREADY_EXISTS")
    }

    payload.password = commonFunctions.hashPassword(payload.password);
    await updateUser(userModel,{email:payload.email},{username:payload.username,email:payload.email,password:payload.password,mobile:payload.mobile},{upsert:true})
    let result = helpers.createSuccessResponse(MESSAGES.SUCCESS);
    return result;
}

userController.login = async (payload) => {
    const user = await findUser(userModel, { email: payload.email });
    if (!user || user.isDeleted) {
        throw helpers.createErrorResponse(MESSAGES.USER_NOT_REGISTER, "DATA_NOT_FOUND");
    }
    if (!commonFunctions.compareHash(payload.password, user.password)) {
        throw helpers.createErrorResponse(MESSAGES.INVALID_PASSWORD, "FORBIDDEN");
    }
    const token = commonFunctions.encryptJwt({ userId: user._id });
    let result = helpers.createSuccessResponse(MESSAGES.LOGGED_IN_SUCCESSFULLY, {token:token});
    return result;
}

module.exports = userController