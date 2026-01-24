import { GoogleGenAI } from "@google/genai";

async function getAiResponse2(code) {
  const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: getPrompt(code), // Prompt
  });
  // Parsing to JSON
  try {
    const data = JSON.parse(response.text);
    return data;
  } catch (err) {
    console.error("Error : ", err);
    return { error: "Error" };
  }
}
import { GoogleGenerativeAI } from "@google/generative-ai";

async function getAiResponse(code) {
  const ai = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(getPrompt(code));
  // Parsing to JSON
  try {
    const data = JSON.parse(result.response.text());
    return data;
  } catch (err) {
    console.error("Error : ", err);
    return { error: "Error" };
  }
}

function getPrompt(code) {
  const prompt = `
IMPORTANT OUTPUT RULES (MANDATORY):
- Output ONLY valid JSON
- Do NOT include markdown, explanations, or extra text
- Do NOT wrap code in triple backticks
- All keys in the schema MUST exist
- If a category has no issues, return an empty array []
- Severity MUST be exactly one of: "low", "medium", "high"

You are a senior software engineer and code reviewer.
You review code for correctness, security, performance, and best practices.

Your goals:
- Be precise and practical
- Explain issues in simple, clear language
- Be honest and critical when required
- Do NOT invent problems that do not exist

Tasks:
1. Identify bugs or logical errors
2. Identify security risks
3. Identify bad practices or poor readability
4. Suggest concrete improvements
5. Provide an improved version of the code

Additional Rules:
- Explanations must be concise (1–3 sentences max)
- Summary must be a single paragraph (no line breaks)
- improvedCode MUST be a single string containing the full revised code
- Show improved code only once

Return the response strictly in the following JSON format:

{
  "summary": "",
  "bugs": [
    {
      "issue": "",
      "severity": "low | medium | high",
      "explanation": ""
    }
  ],
  "security": [
    {
      "issue": "",
      "severity": "low | medium | high",
      "explanation": ""
    }
  ],
  "bestPractices": [
    {
      "issue": "",
      "severity": "low | medium | high",
      "explanation": ""
    }
  ],
  "improvedCode": ""
}

Code to review:
${code}
`;
  return prompt;
}

export { getAiResponse };
