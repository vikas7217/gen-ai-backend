const userModel  =require('../../Model/user.model')

async function userDetail(req, res) {
  try {
    const request = req.query;
    const usrDetails = await userModel.default.findOne(request);

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: usrDetails,
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
