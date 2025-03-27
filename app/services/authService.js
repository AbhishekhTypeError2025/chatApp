'use strict';

const { createErrorResponse } = require('../helpers');
const { MESSAGES, ERROR_TYPES } = require('../utils/constants');
const helpers = require('../helpers');
const commonFunctions = require('../utils/utils');


const authService = {};

authService.authenticateUser = (adminAuth) => (req, res, next) => {
    try {
        let token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(404).json(helpers.createErrorResponse(MESSAGES.TOKEN_NOT_AVAILABLE,ERROR_TYPES.DATA_NOT_FOUND));
        }

        let result = commonFunctions.decryptJwt(token);
        
        req.user = result;
        if (adminAuth && req.user.role !== 'admin') {
            return res.status(403).json(helpers.createErrorResponse(MESSAGES.FORBIDDEN, ERROR_TYPES.FORBIDDEN))
        }
        next()
    }
    catch (err) {
        res.status(401).json(createErrorResponse(err.message, ERROR_TYPES.UNAUTHORIZED))
    }
}

module.exports = authService;
