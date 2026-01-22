import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ResultSection from "./ResultSection";
import { Link, useLocation } from "react-router-dom";
import { generate } from "short-uuid";

export default function GitHubLinkReview() {
  const [githubUrl, setGithubUrl] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const decodeBase64ToUtf8 = (base64) => {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  };

  const parseGithubBlobUrl = (githubUrl) => {
    let url;
    // 1. Invalid URL
    try {
      url = new URL(githubUrl);
    } catch (error) {
      throw new Error("Invalid URL");
    }
    // 2. Validate domain
    if (url.hostname !== "github.com") {
      throw new Error("Not a GitHub URL");
    }
    // 3. Split path
    const parts = url.pathname.split("/").filter(Boolean);
    // Expected:
    // [owner, repo, "blob", branch, ...path]
    if (parts.length < 5 || parts[2] !== "blob") {
      throw new Error("Not a valid GitHub blob file URL");
    }
    const [owner, repo, , branch, ...pathParts] = parts;
    if (!owner || !repo || !branch || pathParts.length === 0) {
      throw new Error("Incomplete GitHub blob URL");
    }
    return { owner, repo, branch, path: pathParts.join("/") };
  };

  const readGithubFile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!githubUrl.trim()) {
        console.log("Code can not be empty");
        return;
      }
      const { owner, repo, branch, path } = parseGithubBlobUrl(githubUrl);
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
      const response = await axios.get(url);
      const code = decodeBase64ToUtf8(response.data.content);
      getAiResponse(code);
    } catch (error) {
      console.log("Url does not exits");
      console.log(error);
      setGithubUrl("");
    }
  };

  const getAiResponse = async (code) => {
    try {
      setLoading(true);
      if (!code) {
        toast.error("Code cannot be empty");
        setLoading(false);
        return;
      }
      setResponse();
      console.log("Getting response...");
      const { data } = await axios.post(
        "http://localhost:3000/api/ai/response",
        { code },
        {
          withCredentials: true,
        },
      );
      setResponse(data);
      // adding history in local storage
      const history = JSON.parse(localStorage.getItem("history")) || [];
      const historyItem = {
        input: code,
        output: data,
        id: generate(),
        timestamp: Date.now(),
      };
      const updatedHistory = [...history, historyItem];
      localStorage.setItem("history", JSON.stringify(updatedHistory));
      console.log("Get response success");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setGithubUrl("");
    }
  };

  return (
    <>
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
              AI Code Reviewer
            </h1>
            <p className="text-sm text-gray-400">
              Analyze your code for bugs, security issues, and best practices
            </p>
          </div>

          <div className="flex">
            <Link
              to="/"
              className="m-4 px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-2"
            >
              Paste your code
            </Link>
            <Link
              to="/upload"
              className="m-4 px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-2"
            >
              Upload file
            </Link>
            <Link
              to="/github"
              className="m-4 px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-2"
            >
              GitHub link
            </Link>
          </div>
          <form onSubmit={readGithubFile} className="p-8 m-4 border rounded">
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="border rounded px-4 py-2 w-full"
              placeholder="GitHub URL, example: https://github.com/:owner/:repo/blob/:branch/:path"
            />
            <button
              type="submit"
              disabled={loading}
              className="my-4 px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review
            </button>
          </form>

          {/* result section */}
          <ResultSection response={response} loading={loading} />
        </div>
      </main>
    </>
  );
}
