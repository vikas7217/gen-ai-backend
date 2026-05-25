const userDetailService = require("../../Service/Servicer/userdetail.service");

async function userDetail(req, res) {
  try {
    const request = req.query;
    const usrDetail = await userModel.default.findOne(request);

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: userDetail,
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}
module.exports = userDetail; 
