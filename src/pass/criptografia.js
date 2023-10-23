import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/configs.js"

class Criptografia {
    
    createHash(dato){
        return bcrypt.hashSync(dato, 10)
    }
    
    
    comparar(actual,almacenada){
        return bcrypt.compareSync(actual, almacenada)
    }

    
    generarToken(dato) {
        jwt.sign(dato, JWT_SECRET, {expiresIn: "1h"})
    }

    //Decodifica token
    decodificarToken(token) {
        return jwt.verify(token, JWT_SECRET)
    }
}

export const cripto = new Criptografia()