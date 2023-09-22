import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { ErrorDeAutenticacion } from "../errors/errorDeAutenticacion.js"
import usersModel from "../dao/models/user.model.js"
import {isValidPassword} from "../midsIngreso/bcryt.js"


passport.use("local", new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, 
async (req, email, password, done) => {
         
    let user = (await usersModel.findOne({email:email}))
    
    if(email == "adminCoder@coder.com" && password == "adminCod3r123"){ user = {
        first_name: "coderhouse",
        email: email,
        password: password,
        rol: "admin",
    }}    
    if(!user){return done(new ErrorDeAutenticacion())}
    if(user.password != "adminCod3r123"){if(!isValidPassword(password, user.password)){return done(new ErrorDeAutenticacion())}}
    if(user.password != "adminCod3r123"){delete user.password}
    done(null, user)    
}))

passport.serializeUser((user, next) => {
    next(null, user['email'])
})

passport.deserializeUser((username, next) => {
    const user = usersModel.findOne({email: username})
    next(null, user)
})

export const initializePassport = passport.initialize();
export const passportSession = passport.session();

export const autenticacionUserPass = passport.authenticate("local", {failWithError: true})