const userModel = require('../../Model/user.model');

async function userRegistrationService(userData){
    try{
        const user = new userModel.default(userData);
        const savedUser = await user.save();
        return savedUser;
    }
    catch(error){
        throw new Error(`Error While registring the user Error : ${error.message}`);
    }
}

module.exports = userRegistrationService;