const userRegistrationService = require("../../Service/User/user.registration.service");
const responseSchema = require("../../utils/response");
const userModel = require("../../Model/user.model");
async function userRegistrationController(req, res) {
  try {

    const userData = req.body;
    const user = new userModel.default(userData);
    const savedUser = await user.save();

    res
      .status(201)
      .json(
        responseSchema.data(true, "User registered successfully", savedUser),
      );
  } catch (error) {
    res.status(500).json(responseSchema.data(false, error.message, null));
  }
}

module.exports = userRegistrationController;
