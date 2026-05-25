const userRegistrationService = require('../../Service/User/user.registration.service');
const responseSchema = require('../../utils/response')

async function userRegistrationController(req,res){
    try{
        console.info(req.body);
        const userData = req.body;
        const registration = await userRegistrationService(userData);
        res.status(201).json(responseSchema.data(true, "User registered successfully", registration))
    }catch(error){
        res.status(500).json(responseSchema.data(false, error.message, null))
    }
}

module.exports = userRegistrationController;