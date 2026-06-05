let express = require("express");
let app = express();
let route = express.Router();
const userRegistrationController = require("../Controller/Auth/user.registration.controller");
const userRegistrationSchema = require("../Validateschema/user.registration.schema");
const schemaValidator = require("../Validateschema/schema.validator");
const auth = require("../Controller/Auth/auth.controller");
const userDetail = require("../Controller/dashbord/userdetail.controller");
const passport = require("passport");

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

/**
 * @route POST /api/auth/forgot-password
 * @description Initiate the forgot password process by sending a reset link to the user's email
 * @access Public
 */
route.post('/auth/forgot-password',auth.forgotPassword)

/**
 * @route POST /api/auth/reset-password
 * @description Reset the user's password using the token sent to their email
 * @access Public
 */
route.post('/auth/reset-password',auth.resetPassword)

/**
 * @route POST /api/auth/user-notification
 * @description Send a notification to the user using the notification service
 * @access Public
 */
route.post('/auth/user-notification', auth.userNotification)

/**
 * @route GET /api/auth/google
 * @description Authenticate a user using Google OAuth 2.0
 * @access Public
 */
route.get('/auth/google', auth.googleAuth)
 

/**
 * @route GET /api/auth/google/callback
 * @description Handle the callback from Google OAuth 2.0 authentication
 * @access Public
 */
route.get('/auth/google/callback', passport.authenticate("google", {
    session: false,
  }), auth.googleAuthCallbackAndToken)

module.exports = route;
