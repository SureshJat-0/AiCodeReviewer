import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { aiRouter } from "./routes/aiCommunication.js";

const app = express();
const PORT = process.env.PORT || 3000;

var corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

// For parsing application/json
app.use(express.json());
app.use(cors(corsOptions));

// Routers
app.use("/api/ai", aiRouter);

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

app.listen(PORT, () => {
  console.log("Server started");
});
