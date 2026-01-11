import express from "express";
import { getRouteAiResponse } from "../controllers/aiCommunication.js";
import { aiRateLimiter } from "../middlewares/middlewares.js";

export const aiRouter = express.Router();

aiRouter.route("/response").post(aiRateLimiter, getRouteAiResponse);