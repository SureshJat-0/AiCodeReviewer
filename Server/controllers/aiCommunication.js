import { getAiResponse } from "../AiFunctions/ai.js";
import CustomExpressError from "../ExpressError.js";

const maxCodeLength = 8000; // charactors

const getRouteAiResponse = async (req, res) => {
  const { code } = req.body;
  if (!code || code.trim().length === 0)
    throw new CustomExpressError(400, "Code cannot be empty");
  if (code.length > maxCodeLength)
    throw new CustomExpressError(
      400,
      `Code is too long. Maximum allowed length is ${maxCodeLength} characters.`
    );
  console.log("Getting response...");
  // Ai timeout
  try {
    const response = await Promise.race([
      // getAiResponse(code),
      new Promise((resolve, reject) => {
        setTimeout(
          () =>
            resolve({
              summary:
                "The code generally works but has issues related to error handling, input validation, and maintainability. These problems can lead to runtime crashes, security risks, and difficulty scaling the application.",
              bugs: [
                {
                  issue: "Missing null checks for request data",
                  severity: "medium",
                  explanation:
                    "The code assumes required request fields always exist. If a client sends incomplete data, the application may throw runtime errors or crash.",
                },
              ],
              security: [
                {
                  issue: "No input validation or sanitization",
                  severity: "high",
                  explanation:
                    "User-provided input is used directly without validation or sanitization, which can lead to injection attacks or unexpected behavior.",
                },
              ],
              bestPractices: [
                {
                  issue: "Hardcoded configuration values",
                  severity: "low",
                  explanation:
                    "Configuration values such as ports or secrets are hardcoded instead of being loaded from environment variables, reducing flexibility across environments.",
                },
              ],
              improvedCode:
                "function handleRequest(req, res) {\n  try {\n    const { username } = req.body || {};\n\n    if (!username) {\n      return res.status(400).json({ error: 'Username is required' });\n    }\n\n    // Process request safely\n    res.status(200).json({ message: 'Request processed successfully' });\n  } catch (error) {\n    res.status(500).json({ error: 'Internal server error' });\n  }\n}",
            }),
          1000
        );
      }),
      new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("AI_TIMEOUT")),
          60 * 1000 // 60 seconds to get ai response
        );
      }),
    ]);
    console.log("Response generated Successfully");
    res.status(200).send(response);
  } catch (err) {
    if (err.message === "AI_TIMEOUT") {
      throw new CustomExpressError(
        504,
        "AI took too long to respond. Please try again."
      );
    }
    console.log(err);
    throw new CustomExpressError(
      500,
      "AI service failed. Please try again later."
    );
  }
};

export { getRouteAiResponse };
