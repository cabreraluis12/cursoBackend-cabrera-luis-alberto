import express from "express";
import { loginController } from "../controller/login.controller.js";
export const loginRouter = express.Router();

loginRouter.post('/register', loginController.register);
loginRouter.post('/login', loginController.login);
loginRouter.get('/current', loginController.getCurrentUser);
loginRouter.get('/github', loginController.authenticateWithGithub);
loginRouter.get('/githubcallback', loginController.githubCallback);
loginRouter.get('/show', loginController.showSession);