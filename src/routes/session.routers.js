import express  from "express";
import userManager from "../dao/userManager.js";
import passport from "passport";
import { passportCall, authorization } from "../midsIngreso/passAuth.js";
import UserController from "../controllers/userController.js";
import AuthControl from "../controllers/authController.js";

const router = express.Router();
const UM = new userManager();
const userController = new UserController();
const authControl = new AuthControl();

router.post("/login",(req,res) => authControl.login(req, res));

router.post("/register", userController.register.bind(userController));

router.post("/logout", (req, res) => authControl.logout(req, res));

router.get("/restore", userController.restore.bind(userController));

router.get("/github", passport.authenticate("github", {scope:["user:email"]}), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}), async (req, res) => {
    req.session.user = req.user;
    req.session.loggedIn = true;
    res.redirect("/profile");
});

router.get("/current", passportCall("jwt"), authorization("user"), (req, res) => {
  userController.current(req,res)
});

export default router;