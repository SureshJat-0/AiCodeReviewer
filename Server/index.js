import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import { aiRouter } from "./routes/aiCommunication.js";
import authRouter from "./routes/authRouter.js";
import reviewRouter from "./routes/review.js";
import OAuthRouter from "./routes/oauth.js";

const app = express();

var corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    "https://accounts.google.com",
    "https://oauth2.googleapis.com",
    "https://www.googleapis.com",
  ],
  credentials: true,
};

// For parsing application/json, cors, cookies
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// mongoDb connect
mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => {
    console.log("MongoDb Connected!");
  })
  .catch((err) => console.log(err));

// Routers
app.use("/api/ai", aiRouter);
app.use("/api/auth", authRouter);
app.use("/api/oauth", OAuthRouter);
app.use("/api/review", reviewRouter);

// error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;

  // ai rate limit error
  if (err?.response?.status === 429) {
    err.message = "You are sending requests too fast. Please wait a minute.";
  }
  console.log("Error message - ", err.message);
  res.status(statusCode).send({
    error: {
      success: false,
      message: err.message,
    },
  });
});

// 404 - page not found
app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
