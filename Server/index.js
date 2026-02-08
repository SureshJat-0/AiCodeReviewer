import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { aiRouter } from "./routes/aiCommunication.js";
import authRouter from "./routes/authRouter.js";
import reviewRouter from "./routes/review.js";

const app = express();
const PORT = process.env.PORT || 3000;

var corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

// For parsing application/json
app.use(express.json());
app.use(cors(corsOptions));

// mongoDb connect
mongoose
  .connect(`${process.env.MONGO_URI}/aiCodeReviewer`)
  .then(() => {
    console.log("MongoDb Connected!");
  })
  .catch((err) => console.log(err));

// Routers
app.use("/api/ai", aiRouter);
app.use("/api/auth", authRouter);
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
