"use strict";
const response = require("../../utils/response");
const userModel = require("../../Model/user.model");
const Session = require("../../Model/session.model");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const generateOTP = require("../../utils/otpgenerator");
const notificationService = require("../../Service/Servicer/notification");
const notificationBody =
  require("../../utils/notificationbody").notificationBody;
const passport = require("passport");
/**
 * @param { email:string,password:string}
 */
async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    // Find the user by email and check if the account is active
    const user = await userModel.default.findOne({ email, isActive: 1 });

    if (!user) {
      throw new Error(`User not found with email : ${email}`);
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bycrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }

    // Generate JWT tokens for authentication and refresh
    const loginToken = jwt.sign(
      {
        email: email,
        userType: user.userRole,
        userId: user._id,
        jti: crypto.randomUUID(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "20m" },
    );

    const refreshToken = jwt.sign(
      { email: email, userType: user.userRole },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    // Set the refresh token in an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Hash the refresh token before storing it in the database for security
    const refreshTokenHash = await crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const sessionData = new Session.default({
      user: user._id,
      refreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await sessionData.save();

    res.status(200).json(
      response.data(true, "Login successful", {
        loginToken,
        email: email,
        userType: user.userRole,
      }),
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

/**
 * @description Middleware to validate the authentication token in the request headers
 * @param {Object} req - The request object containing headers and other request details
 * @param {Object} res - The response object used to send responses back to the client
 * @param {Function} next - The next middleware function to call if authentication is successful
 * @returns {Object} - Returns a JSON response with success status and message if authentication fails, otherwise calls the next middleware
 */
async function validateAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization token is missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const blacklistKey = `blacklist:${decoded.jti}`;
    const isTokenBlacklisted = await global.client.get(blacklistKey);

    if (isTokenBlacklisted) {
      return res
        .status(401)
        .json({ success: false, message: "Token has been revoked" });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}

async function refreshToken(req, res) {
  try {
    // Get the refresh token from the HTTP-only cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token is missing" });
    }

    // Verify the refresh token and check if it's valid
    const isRefreshTokenValid = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET,
    );
    if (!isRefreshTokenValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    // Hash the refresh token and check if it exists in the database and is not revoked for security
    const refreshTokenHash = await crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await Session.default.findOne({
      refreshTokenHash: refreshTokenHash,
      revoked: false,
    });
    // If the session is found and the refresh token is revoked, return an error response else create a new login token and return it to the client
    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const loginToken = jwt.sign(
      {
        email: isRefreshTokenValid.email,
        userType: isRefreshTokenValid.userRole,
      },
      process.env.JWT_SECRET,
      { expiresIn: "20m" },
    );

    const newRefreshToken = jwt.sign(
      {
        email: isRefreshTokenValid.email,
        userType: isRefreshTokenValid.userRole,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    // Set the refresh token in an HTTP-only cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Hash the refresh token before storing it in the database for security
    const newRefreshTokenHash = await crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    res.json(
      response.data(true, "Token refreshed successfully", {
        loginToken,
        email: isRefreshTokenValid.email,
        userType: isRefreshTokenValid.userRole,
      }),
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function logoutUser(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const accesstoken =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token is missing" });
    }

    if (!accesstoken) {
      return res
        .status(401)
        .json({ success: false, message: "Access token is missing" });
    }

    const refreshTokenHash = await crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await Session.default.findOne({
      refreshTokenHash: refreshTokenHash,
      revoked: false,
    });

    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");

    // const accesstokenHash = await crypto
    //   .createHash("sha256")
    //   .update(accesstoken)
    //   .digest("hex");

    // const blacklistKey = `blacklist:${accesstokenHash}`;

   

    

    const decoded = jwt.decode(accesstoken);
    const blacklistKey = `blacklist:${decoded.jti}`;

    const ttl = decoded?.exp
      ? decoded.exp - Math.floor(Date.now() / 1000)
      : 20 * 60;
    if (ttl > 0) {
      await global.client.set(blacklistKey, "revoked", { EX: ttl }); // Set the blacklist entry to expire when the access token would naturally expire
    }

    res.json(response.data(true, "Logout successful", null));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function loginWithOtp(req, res) {
  try {
    const { email } = req.body;
    // Find the user by email and account is active
    const user = await userModel.default.findOne({ email, isActive: 1 });

    if (!user) {
      throw new Error(`User not found with email : ${email}`);
    }

    const generatedOTP = generateOTP.generateOTP().toString();

    const hashOTP = await bycrypt.hash(generatedOTP, 10);

    const otpkey = `otp:${user._id}`;

    const notifyBody = notificationBody.otpNotificationTemplate(
      email,
      generatedOTP,
      user.userName,
    );

    const notifyId = await notificationService.notificationService(notifyBody);

    await global.client.set(otpkey, hashOTP, {
      EX: 60 * 1000, // OTP expires in 60 seconds
    });

    res.status(200).json({
      message: "otp is sent successfullty",
      notifyId: notifyId,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function verifyLoginOtp(req, res) {
  try {
    const { email, otp } = req.body;
    // Find the user by email and account is active
    const user = await userModel.default.findOne({ email, isActive: 1 });

    if (!user) {
      throw new Error(`User not found with email : ${email}`);
    }

    const otpkey = `otp:${user._id}`;

    const storedOTP = await global.client.get(otpkey);
    if (!storedOTP) {
      throw new Error("OTP has expired or is invalid");
    }

    const isMatch = await bycrypt.compare(otp, storedOTP);

    if (!isMatch) {
      throw new Error("Invalid OTP");
    }

    res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    // Find the user by email and account is active
    const user = await userModel.default.findOne({ email, isActive: 1 });

    if (!user) {
      throw new Error(`User not found with email : ${email}`);
    }

    const generatedOTP = generateOTP.generateOTP().toString();

    const hashOTP = await bycrypt.hash(generatedOTP, 10);

    const otpkey = `otp:${user._id}`;

    const notifyBody = notificationBody.getForgotPasswordOtpTemplate(
      email,
      generatedOTP,
      user.userName,
    );

    const notifyId = await notificationService.notificationService(notifyBody);

    await global.client.set(otpkey, hashOTP, {
      EX: 60 * 1000, // OTP expires in 60 seconds
    });

    res.status(200).json({
      message: "otp is sent successfullty",
      notifyId: notifyId,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, password, newPassword } = req.body;
    // Find the user by email and account is active
    const user = await userModel.default.findOne({ email, isActive: 1 });

    if (!user) {
      throw new Error(`User not found with email : ${email}`);
    }
    const isPasswordMatch = await bycrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid current password");
    }

    user.password = newPassword;
    await user.save();

    const notifyBody = notificationBody.getPasswordChangedTemplate(
      email,
      user.userName,
    );

    const notifyId = await notificationService.notificationService(notifyBody);

    res.status(200).json({
      message: "Password reset successfully",
      notifyId: notifyId,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function userNotification(req, res) {
  try {
    const { to, subject, text, html, attachments } = req.body;

    const notifyBody = {
      to,
      subject,
      text,
      html: html ? html : undefined,
      attachments,
    };

    const notifyId = await notificationService.notificationService(notifyBody);

    res.status(200).json({
      message: "Notification sent successfully",
      notifyId: notifyId,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function googleAuth(req, res, next) {
  try {
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next,
    );
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function googleAuthCallbackAndToken(req, res) {
  try {
    const user = req.user;
    // Generate JWT tokens for authentication and refresh
    const loginToken = jwt.sign(
      {
        email: user.email,
        userType: "normal",
        userId: user?._id,
        jti: crypto.randomUUID(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "20m" },
    );

    const refreshToken = jwt.sign(
      { email: user.email, userType: "normal" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    // Set the refresh token in an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Hash the refresh token before storing it in the database for security
    const refreshTokenHash = await crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const sessionData = new Session.default({
      user: user._id,
      refreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await sessionData.save();

    res.redirect(
      `http://127.0.0.1:5500?token=${loginToken}&email=${user.email}&userType=normal`,
    );
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}
exports.loginController = loginController;
exports.validateAuth = validateAuth;
exports.refreshToken = refreshToken;
exports.logoutUser = logoutUser;
exports.loginWithOtp = loginWithOtp;
exports.verifyOtp = verifyLoginOtp;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.userNotification = userNotification;
exports.googleAuth = googleAuth;
exports.googleAuthCallbackAndToken = googleAuthCallbackAndToken;
