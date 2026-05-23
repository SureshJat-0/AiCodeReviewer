import express from "express";
import { login, logout, profile, refreshAccessToken, signup } from "../controllers/auth.js";
import auth from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.route("/signup").post(signup);
authRouter.route("/login").post(login);
authRouter.route("/logout").post(logout);
authRouter.route("/me").get(auth, profile);
authRouter.route("/refresh").get(refreshAccessToken);

export default authRouter;
