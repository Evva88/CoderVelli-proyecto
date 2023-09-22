import { usersManager } from "../dao/usersManager.js"
import { cripto } from "../pass/criptografia.js"


class AuthenticationService {
    constructor({ usersManager,cripto}) {
        this.usersManager = usersManager
        this.cripto = cripto
       
    }
    async login({username,password}) {
       
        try {
          const userLogged = (await this.usersManager.obtenerSegunCampo({campo: "username",valor: username}))||null;
          if (userLogged) {
            if (userLogged) {
            const rol = userLogged.email === "adminCoder@coder.com" ? "admin" : "usuario";

    req.session.user = {
      id: userLogged._id,
      email: userLogged.email,
      first_name: userLogged.first_name,
      last_name: userLogged.last_name,
      rol: rol,
    };

    console.log(
      "Valor de req.session.user después de la autenticación:",
      req.session.user
    );

    const userToReturn = userLogged;
    console.log("Valor de userToReturn:", JSON.stringify(userToReturn));
    return userToReturn;
  }
  console.log(
    "Valor de userLogged antes de devolver falso:",
    JSON.stringify(userLogged)
  );
  return false;
        }
       if (!this.cripto.comparar(password, user.password)) {
            throw new Error("error de autenticacion")
        }
        const token = this.cripto.generarToken(user)
        return token
        } catch (error) {
            throw new Error("error de autenticacion")
        }

    }
 
}

export const authenticationService = new AuthenticationService({
    userManager: usersManager,
    cripto: cripto
})