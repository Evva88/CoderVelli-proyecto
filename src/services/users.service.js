import { usersManager } from "../dao/userManager.js";

class UsuariosService{
    async registrar(datosFuturoUsuario){
        const usuarioRegistrado = await usersManager.guardar(datosFuturoUsuario);
        return usuarioRegistrado;
    }
}

export const usuariosService = new UsuariosService()