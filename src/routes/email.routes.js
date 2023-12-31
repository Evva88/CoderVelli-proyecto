import { Router } from "express";
import { sendEmail, sendEmailWithAttachments } from "../controllers/email.controller.js";

const emailRouter = new Router();

emailRouter.get("/", sendEmail);
emailRouter.get("/attachments", sendEmailWithAttachments);

export default emailRouter;