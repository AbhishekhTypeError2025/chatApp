'use strict';

const { Joi } = require('../../utils/joiUtils');
const { userController } = require('../../controllers');

module.exports = [
    {
        method: 'POST',
        path: '/user/register',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'register a new user',
            model: 'UserRegister',
            body: {
                username: Joi.string().required(),
                email: Joi.string().email().required().isValidEmail(),
                password: Joi.string().required(),
                mobile: Joi.string().required(),
            }
        },
        handler: userController.registerUser
    },
    {
        method: "GET",
        path: '/user/hello',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'register a new user',
            model: 'UserRegister',
        },
        handler:userController.hello
    }
];