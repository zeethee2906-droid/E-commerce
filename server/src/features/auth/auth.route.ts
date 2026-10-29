import { Router } from "express";
import { checkMe, createAccount, login, logout } from "./auth.controller";
import { assessRole } from "./auth.middleware";

const authRoute = Router();

authRoute.post("/create-account", createAccount);
authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.get("/me",checkMe);



export default authRoute;
