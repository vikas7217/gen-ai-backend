 const userRegistrationSchema  ={
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // format: email,
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