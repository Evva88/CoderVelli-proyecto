import express  from "express";
import userManager from "../dao/userManager.js";
import { createHash } from "../midsIngreso/bcryt.js";
import passport from "passport";
import usersModel from "../dao/models/user.model.js";

const router = express.Router();
const UM = new userManager();

router.post("/login", passport.authenticate("local"), async(req,res) => {
    if(!req.user) return res.status(400).send({status: "error", error:"Invalid"})

    const email = req.user.email
    let user = await usersModel.findOne({email})
    if(user){req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol
    }}
    if(user === "adminCoder@coder.com"){req.session.user = {
        rol: "admin"
    } 
}
    res.sendStatus(201)
})

router.post("/register", async (req,res)=>{
    try {
        const {
            first_name,
            last_name,
            email,
            age,
            password
        } = req.body;
        const existe = await UM.getUserByEmail({
            email
        })
        if (existe) {
            return res.status(400).send({
                status: "error",
                error: "Este mail ya esta registrado"
            })
        }
        const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
        }

        let result = await UM.addUser(user)
        console.log(result)

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            rol: "usuario"
        }

        console.log(req.session.user)
        
        res.redirect("/login");
        res.status(201).send({
            status: "success",
            message: "Usuario Registrado!"
        })


    } catch (error) {
        return(error)
    }
   
})


router.post("/logout", async (req, res) => {
    req.session.destroy(err => {
        if(err) {
          return res.redirect('/profile');
        }
          res.redirect('/login');
      });
});


router.get("/restore", async (req, res) => {
    let {user, pass} = req.query;
    pass = createHash(pass);
    const passwordRestored = await UM.restorePassword(user, pass);

    if (passwordRestored) {
        res.send({status:"OK", message:"La contraseña se ha actualizado correctamente!"});
    } else {
        res.status(401).send({status:"Error", message:"No se pudo actualizar la contraseña!"});
    }    
});


router.get("/github", passport.authenticate("github", {scope:["user:email"]}), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}), async (req, res) => {
    req.session.user = req.user;
    req.session.loggedIn = true;
    res.redirect("/profile");
});

export default router;