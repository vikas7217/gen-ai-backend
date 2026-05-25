let express = require('express');
let app = express();
let route = express.Router();
const userRegistrationController = require('../Controller/Auth/user.registration.controller');
const userRegistrationSchema = require('../schema/user.registration.schema')
const schemaValidator = require('../schema/schema.validator');
const auth = require('../Controller/Auth/auth.controller');
const userDetail = require('../Controller/dashbord/userdetail.controller')

/**
 * @route POST /api/user/register
 * @desc Register a new user
 * @access Public
 * @body { userName: String, email: String, password: String }
 * @returns { success: Boolean, message: String, data: Object }
 */
route.post('/user/register',schemaValidator(userRegistrationSchema), userRegistrationController);


/**
 * @route POST /api/user/login
 * @description Login a user
 * @access Public
 */
route.post('/user/login',auth.loginController)


/**
 * @route GET /api/servicer/details
 * @description getr the details of the specified user
 * @access Public
 */
route.get('/servicer/details',auth.validateAuth,userDetail)

module.exports = route;