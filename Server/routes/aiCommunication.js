import express from "express";
import {
  getAiResponseController,
  getResponseUploadFile,
} from "../controllers/aiCommunication.js";
import { aiRateLimiter } from "../middlewares/rateLimiter.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

export const aiRouter = express.Router();

aiRouter.route("/response").post(aiRateLimiter, getAiResponseController);
aiRouter.route("/upload").post(upload.single("file"), getResponseUploadFile);
