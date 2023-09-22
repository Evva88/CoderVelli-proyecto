import bcrypt from "bcrypt"


export function createHash(frase) {
    return bcrypt.hashSync(frase, bcrypt.genSaltSync(10))
}


export function isValidPassword(recibida,almacenada){
    return bcrypt.compareSync(recibida,almacenada)
}

