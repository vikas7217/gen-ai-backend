let express = require("express");
let app = express();
let route = express.Router();
const userRegistrationController = require("../Controller/Auth/user.registration.controller");
const userRegistrationSchema = require("../Validateschema/user.registration.schema");
const schemaValidator = require("../Validateschema/schema.validator");
const auth = require("../Controller/Auth/auth.controller");
const userDetail = require("../Controller/dashbord/userdetail.controller");

/**
 * @route POST /api/user/register
 * @desc Register a new user
 * @access Public
 * @body { userName: String, email: String, password: String }
 * @returns { success: Boolean, message: String, data: Object }
 */
route.post(
  "/auth/user/register",
  schemaValidator(userRegistrationSchema),
  userRegistrationController,
);

/**
 * @route POST /api/login
 * @description Login a user
 * @access Public
 */
route.post("/auth/login", auth.loginController);

/**
 * @route POST /api/auth/refreshtoken
 * @description Refresh the authentication token for a user
 * @access Public
 */

route.get("/auth/refreshtoken", auth.refreshToken);

/**
 * @route GET /api/servicer/details
 * @description getr the details of the specified user
 * @access Public
 */
route.get("/user/servicer/details", auth.validateAuth, userDetail);

/** 
 * @route POST /api/auth/logout
 * @description Logout a user by invalidating the refresh token and clearing the cookie
 * @access Public
 */
route.post('/auth/logout',auth.logoutUser)

/**
 * @route POST /api/auth/login/otp
 * @description Login a user using OTP (One-Time Password) sent to their email
 * @access Public
 */
route.post('/auth/login/otp',auth.loginWithOtp)

/**
 * @route POST /api/auth/verify/otp
 * @description Verify the OTP (One-Time Password) sent to the user's email for login
 * @access Public
 */
route.post('/auth/verify/otp',auth.verifyOtp)

module.exports = route;
