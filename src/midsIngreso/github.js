import passport from "passport";
import GitHubStrategy from "passport-github2";
import usersModel from "../dao/models/user.model.js"



const initializeGitHubPassport = () => {
    
    passport.use("github", new GitHubStrategy({
        clientID:"d74f1894669cb0631f8a",
        clientSecret:"cb4771aeebbc895266e60b00befa310d49a30ea9",
        callbackURL:"http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await usersModel.findOne({email:profile._json.email});

            if (user) {
                return done(null, user);
            } else {
                let newUser = { 
                    first_name:profile._json.name,
                    last_name:"",
                    email:profile._json.email,
                    age:100,
                    password:""
                    
                    
                }
                let result = await usersModel.create(newUser);

                return done(null, result);
            }
        } catch(error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await usersModel.findById(id);
        done(null, user);
    });
};

export default initializeGitHubPassport;
