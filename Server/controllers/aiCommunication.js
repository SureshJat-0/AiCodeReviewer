import { getAiResponse } from "../AiFunctions/ai.js";
import CustomExpressError from "../ExpressError.js";
import fs from "fs";

const maxCodeLength = 10000; // charactors

const getAiResponseController = async (req, res) => {
  const { code } = req.body;
  if (!code || code.trim().length === 0)
    throw new CustomExpressError(400, "Code cannot be empty");
  if (code.length > maxCodeLength)
    throw new CustomExpressError(
      400,
      `Code is too long. Maximum allowed length is ${maxCodeLength} characters.`,
    );
  console.log("Getting response...");
  // Ai timeout
  try {
    const response = await Promise.race([
      getAiResponse(code),
      new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("AI_TIMEOUT")),
          120 * 1000, // 120 seconds to get ai response
        );
      }),
    ]);
    console.log("Response generated Successfully");
    res.status(200).send(response);
  } catch (err) {
    if (err.message === "AI_TIMEOUT") {
      throw new CustomExpressError(
        504,
        "AI took too long to respond. Please try again.",
      );
    }
    console.log(err);
    throw new CustomExpressError(
      500,
      "AI service failed. Please try again later.",
    );
  }
};

const getResponseUploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const text = fs.readFileSync(req.file.path, "utf-8");
    if (!text) throw new CustomExpressError(500, `Can not read you file`);
    // Remove file after reading
    fs.unlinkSync(req.file.path);
    res.json({
      success: true,
      content: text,
    });
  } catch (error) {
    console.log(error);
    throw new CustomExpressError(500, "Error while reading your file");
  }
};

export { getAiResponseController, getResponseUploadFile };
