import usersModel from "./models/user.model.js";
import { isValidPassword } from "../midsIngreso/bcrypt.js";

class UserManager {
     async addUser(user) {
        try {
            if(user.email == "adminCoder@coder"){
                ures.rol= "admin"
            }
            
            await usersModel.create(user)
            console.log("User added!");
    
            return true;
        } catch (error) {
            return false;
        }
    }
    
    async login(user, pass, req) {
        try {
          const userLogged = await usersModel.findOne({ email: user });
    
          if (userLogged && isValidPassword(userLogged, pass)) {
            const rol =
              userLogged.email === "adminCoder@coder.com" ? "admin" : "usuario";
    
            req.session.user = {
              id: userLogged._id,
              email: userLogged.email,
              first_name: userLogged.first_name,
              last_name: userLogged.last_name,
              rol: rol,
            };
    
            const userToReturn = userLogged;
            return userToReturn;
          }
          return false;
        } catch (error) {
          console.error("Error durante el login:", error);
          return false;
        }
      }
   
    
    async getUserByEmail(user) {
        try {
            const userRegisteredBefore= await usersModel.findOne([{email:user}]) || null;
             if(userRegisteredBefore){
                console.log("Mail registrado anteriormente");
                return user
             }
            
            return true;
        } catch (error) {
            return false;
        }
      
    }
   
    async restorePassword(user, pass) {
        try {
            const userLogged = await usersModel.updateOne({email:user}, {password:pass}) || null;
            
            if (userLogged) {
                console.log("Password Restored!");
                return userLogged;
            }

            return false;
        } catch (error) {
            return false;
        }
    }
    
   
    async obtenerSegunCampo({campo,valor}) {
        const criterio = {}
        criterio[campo] = valor
        const buscado = await usersModel.findOne(criterio).lean()
        if (!buscado) {
            throw new Error("no encontrado")
        } else {
            return buscado
        }

    }
};
    

export default UserManager;