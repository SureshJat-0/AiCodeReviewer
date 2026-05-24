import express from "express";

import {
  OAuthCallback,
  redirectOAuth,
  gitHubRedirectOAuth,
  gitHubOAuthCallback,
  exchangeToken,
} from "../controllers/OAuth.js";

const OAuthRouter = express.Router();

OAuthRouter.route("/google").get(redirectOAuth);
OAuthRouter.route("/google/callback").get(OAuthCallback);

OAuthRouter.route("/github").get(gitHubRedirectOAuth);
OAuthRouter.route("/github/callback").get(gitHubOAuthCallback);

OAuthRouter.route("/exchange").post(exchangeToken);

export default OAuthRouter;
