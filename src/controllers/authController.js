import { authenticationService } from "../services/auth.service.js";

export async function postSessions(req,res,next){
    const {username, password} = req.body;
    try {
	    const token = await authenticationService.login({username,password})
        res.cookie("authToken", token, {signed: true, httpOnly: true})
        res.status(201).json({status: "success"})
    } catch (error) {
        next(error)
    }
}
