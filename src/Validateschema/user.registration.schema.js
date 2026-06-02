 const userRegistrationSchema  ={
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        test : /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        minLength: 6,
        required: true    
    }
}

module.exports = userRegistrationSchema;