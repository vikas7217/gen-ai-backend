const mongoose = require('mongoose');

const userLoginSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

export default mongoose.model("UserLogin",userLoginSchema);