import passport from "passport";
import local from "passport-local";
import usersModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "./bcrypt.js";
import jwt from "passport-jwt";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (username, password, done) => {
        console.log("[Auth] Trying to authenticate user:", username);

        try {
          let user = await usersModel.findOne({ email: username });

          if (!user) {
            return done(null, false, { message: "Usuario incorrecto." });
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Contraseña incorrecta." });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await usersModel.findOne({ email: username });
          if (user) {
            console.log("Usuario ya registrado en nuestra base de datos");
            return done(null, false);
          }
          user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          if (
            user.email == "adminCoder@coder.com" &&
            password === "adminCod3r123"
          ) {
            user.rol = "admin";
          } else {
            user.rol = "user";
          }
          let resultado = await usersModel.create(user);
          console.log("Usuario registrado correctamente " + resultado);
          if (resultado) {
            return done(null, resultado);
          }
        } catch (error) {
          console.log("Error en el registro", error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "GALL2T1TAD2L1MON",
      },
      async (jwt_payload, done) => {
        try {
          const user = await usersModel.findOne({ email: jwt_payload.email });
          if (!user) {
            return done(null, false, {
              message: "Usuario no encontrado en nuestra base de datos",
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  let user = await usersModel.findById(id);
  done(null, user);
});

export default initializePassport;

const cookieExtractor = (req) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }

  return token;
};
