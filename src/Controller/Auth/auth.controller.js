const response = require("../../utils/response");
const userModel = require("../../Model/user.model");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @param { email:string,password:string}
 */
async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.default.findOne({ email, isActive: 1 });
    if (!user) {
      throw new Error(`User not found with email : ${email}`);
    }
    const isPasswordMatch = await bycrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }

    const loginToken = jwt.sign(
      { email: email, userType: user.userRole },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    
    const refreshToken = jwt.sign(
      { email: email, userType: user.userRole },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json(response.data(true, "Login successful", loginToken));
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

    const isTokenValid = jwt.verify(token, process.env.JWT_SECRET);

    if (!isTokenValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

exports.loginController = loginController;
exports.validateAuth = validateAuth;
