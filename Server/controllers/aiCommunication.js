import { getAiResponse } from "../AiFunctions/ai.js";
import CustomExpressError from "../ExpressError.js";
import fs from "fs";

const maxCodeLength = 8000; // charactors

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
      // new Promise((resolve, reject) => {
      //   setTimeout(
      //     () =>
      //       resolve({
      //         summary:
      //           "The provided code suffers from a critical SQL injection vulnerability and lacks robust error handling and input validation. It uses unsafe string concatenation for database queries and fails to provide appropriate HTTP status codes or filter sensitive data from the database response.",
      //         bugs: [
      //           {
      //             issue: "Missing error handling",
      //             severity: "medium",
      //             explanation:
      //               "The database callback does not account for potential errors during execution, which could lead to unhandled exceptions or hung requests.",
      //           },
      //           {
      //             issue: "Asynchronous flow control",
      //             severity: "low",
      //             explanation:
      //               "Using a traditional callback pattern in modern Node.js environments makes the code harder to read and maintain compared to async/await.",
      //           },
      //         ],
      //         security: [
      //           {
      //             issue: "SQL Injection",
      //             severity: "high",
      //             explanation:
      //               "The userId is concatenated directly into the SQL string, allowing an attacker to execute arbitrary database commands by manipulating the query parameter.",
      //           },
      //           {
      //             issue: "Exposure of sensitive data",
      //             severity: "medium",
      //             explanation:
      //               "Using SELECT * returns all columns from the user table, which likely includes sensitive information such as password hashes or private tokens.",
      //           },
      //         ],
      //         bestPractices: [
      //           {
      //             issue: "Lack of HTTP status codes",
      //             severity: "low",
      //             explanation:
      //               "The function returns generic messages without proper HTTP status codes, such as 400 for bad requests or 500 for internal errors.",
      //           },
      //           {
      //             issue: "Missing input validation",
      //             severity: "low",
      //             explanation:
      //               "The code does not verify if the provided ID is in the correct format (e.g., an integer) before attempting to query the database.",
      //           },
      //         ],
      //         improvedCode:
      //           "async function getUserData(req, res) {\n" +
      //           "  const userId = req.query.id;\n" +
      //           "\n" +
      //           "  if (!userId) {\n" +
      //           '    return res.status(400).json({ error: "User ID not provided" });\n' +
      //           "  }\n" +
      //           "\n" +
      //           "  try {\n" +
      //           "    // Use parameterized queries to prevent SQL injection and select only necessary fields\n" +
      //           '    const query = "SELECT id, username, email FROM users WHERE id = ?";\n' +
      //           "    const [rows] = await database.execute(query, [userId]);\n" +
      //           "\n" +
      //           "    if (!rows || rows.length === 0) {\n" +
      //           '      return res.status(404).json({ error: "User not found" });\n' +
      //           "    }\n" +
      //           "\n" +
      //           "    res.status(200).json(rows[0]);\n" +
      //           "  } catch (error) {\n" +
      //           '    console.error("Database error:", error);\n' +
      //           '    res.status(500).json({ error: "Internal server error" });\n' +
      //           "  }\n" +
      //           "}",
      //       }),
      //     1000,
      //   );
      // }),
      new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("AI_TIMEOUT")),
          60 * 1000, // 60 seconds to get ai response
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
    // Remove file after reading
    fs.unlinkSync(req.file.path);
    res.json({
      success: true,
      content: text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Fail to read file");
  }
}

export { getAiResponseController, getResponseUploadFile };
