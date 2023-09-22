import { usuariosService } from "../services/users.service.js"
import { cripto } from "../pass/criptografia.js"

export async function postUsers(req, res, next){
    const {username, password} = req.body
    const user = await usuariosService.registrar({username, password})
    const token = cripto.generarToken(user)
    res.cookie("authToken", token, {expiresIn: "1h", httpOnly: true})
    res.status(201).json(user)

}