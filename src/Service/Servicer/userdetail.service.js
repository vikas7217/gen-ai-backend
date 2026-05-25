const userModel = require("../../Model/user.model");
async function userDetailService(body) {
  try {
    const usrDetail  = await userModel.default.findOne(body.query)
    return usrDetail;
  } catch (error) {
    throw new Error(`Error while fetching user details : ${error.message}`);
  }
}
module.exports = userDetailService;