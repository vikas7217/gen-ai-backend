const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../Model/user.model");

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
    },
    async(accessToken, refreshToken, profile, cb) => {
        try{
      let user = await  userModel.default.findOne({ email: profile.emails[0].value })

        if(!user){
            user = await userModel.default({
                userName: profile.displayName,
                email: profile.emails[0].value, 
                oauthProviders: "google"
            })
           await user.save();
        }
        return cb(null, user);
        }catch(error){
            return cb(error, null);
        }
    }
)
);

module.exports = passport;