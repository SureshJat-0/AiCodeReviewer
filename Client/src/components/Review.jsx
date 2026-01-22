import { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { generate } from "short-uuid";
import { toast } from "react-hot-toast";
import { FiCode, FiCopy, FiTrash2 } from "react-icons/fi";
import { HiLightningBolt } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import ResultSection from "./ResultSection";

export default function Home() {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("// Write or paste your code\n");
  const location = useLocation();

  const editorRef = useRef(null);

  const handleMount = (editor) => {
    editorRef.current = editor;
  };
  const handleEditorChange = (value) => {
    setCode(value);
  };

  const getResponse = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!code) return toast.error("Code cannot be empty");
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
    } catch (err) {
      // backend-sent errors
      if (err?.response?.data?.error?.message) {
        toast.error(err.response.data.error.message);
        console.error(err.response.data.error.message);
        return;
      }
      // axios / network / timeout errors
      toast.error(err.message);
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCodeToClipboard = async () => {
    const demoCode = `function getUserData(req, res) {
const userId = req.query.id;
  if (userId) {
    const query = "SELECT * FROM users WHERE id = " + userId;
    database.execute(query, function (result) {
      res.send(result);
    });
  } else {
    res.send("User ID not provided");
  }
}`;
    try {
      await navigator.clipboard.writeText(demoCode);
      toast.success("Copied");
      console.log("Code copied!");
    } catch (err) {
      toast.error("Failed to copy");
      console.error("Failed to copy text: ", err);
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

          <form onSubmit={getResponse} className="space-y-6 mb-8">
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <FiCode className="w-5 h-5 text-blue-400" />
                  Code Editor
                </h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={copyCodeToClipboard}
                    className="px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-2"
                  >
                    <FiCopy className="w-4 h-4" />
                    Demo Code
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setCode("");
                    }}
                    className="px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-2"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Clear
                  </button>
                </div>
              </div>
              <div className="p-2">
                <Editor
                  height="50vh"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleMount}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: true,
                    scrollBeyondLastLine: true,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md"
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                  Analyzing Code...
                </>
              ) : (
                <>
                  <HiLightningBolt className="w-5 h-5" />
                  Analyze Code
                </>
              )}
            </button>
          </form>
          <ResultSection
            response={response}
            loading={loading}
          />
        </div>
      </main>
    </>
  );
}
