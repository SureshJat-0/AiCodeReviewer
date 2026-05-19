import express from "express";

import { OAuthCallback, redirectOAuth } from "../controllers/OAuth.js";

const OAuthRouter = express.Router();

OAuthRouter.route("/").get(redirectOAuth);
OAuthRouter.route("/callback").get(OAuthCallback);

export default OAuthRouter;
