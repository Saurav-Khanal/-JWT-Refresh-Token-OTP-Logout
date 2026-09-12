import { Router } from "express";
import * as authcontroller from "../controllers/auth.controller.js";

const authRouter=Router();

authRouter.post("/register",authcontroller.register);

authRouter.get("/get-me",authcontroller.getMe);
export default authRouter;