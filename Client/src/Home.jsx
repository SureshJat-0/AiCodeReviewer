import { useState } from "react";
import "./App.css";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { generate } from "short-uuid";
import { toast, Toaster } from "react-hot-toast";

export default function Home() {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("// Write or paste your code\n");
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const copyImprovedCodeToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response.improvedCode);
      toast.success("Copied");
      console.log("Improved code copied!");
    } catch (err) {
      toast.error("Failed to copy");
      console.error("Failed to copy text: ", err);
    }
  };

  const SeverityBadge = ({ severity }) => {
    const colors = {
      low: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      high: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[severity?.toLowerCase()] || colors.medium}`}
      >
        {severity}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-gray-100">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#f3f4f6",
            border: "1px solid #374151",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#1a1a1a",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#1a1a1a",
            },
          },
        }}
      />

      {/* Left Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-56" : "w-14"} bg-[#141414] border-r border-gray-800/50 transition-all duration-300 flex flex-col`}
      >
        <div className="p-3 border-b border-gray-800/50 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">AI</span>
              </div>
              <h2 className="font-medium text-sm text-gray-200">Code Review</h2>
            </div>
          ) : (
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 hover:bg-[#1e1e1e] rounded-md transition-colors ${!sidebarOpen && "hidden"}`}
          >
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-2">
          <button
            onClick={() => !sidebarOpen && setSidebarOpen(true)}
            aria-label="New Review"
            title={sidebarOpen ? undefined : "New Review"}
            className={`w-full flex items-center gap-2.5 rounded-md bg-[#1e1e1e] text-gray-300 hover:bg-[#252525] transition-colors ${sidebarOpen ? "px-3 py-2" : "p-2 justify-center"}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            {sidebarOpen && (
              <span className="text-sm font-medium">New Review</span>
            )}
          </button>

          <Link
            to="/history"
            aria-label="History"
            title={sidebarOpen ? undefined : "History"}
            className={`w-full flex items-center gap-2.5 rounded-md text-gray-400 hover:bg-[#1e1e1e] hover:text-gray-300 transition-colors ${sidebarOpen ? "px-3 py-2" : "p-2 justify-center"}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {sidebarOpen && <span className="text-sm">History</span>}
          </Link>

          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Expand Sidebar"
              title="Expand Sidebar"
              className="w-full flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-[#1e1e1e] hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </nav>

        {sidebarOpen && (
          <div className="p-3 border-t border-gray-800/50">
            <Link
              to="/login"
              aria-label="Sign In"
              className="w-full px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors flex items-center gap-2 justify-center"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1m0-4V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign In
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content */}
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

          <form onSubmit={getResponse} className="space-y-6 mb-8">
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  Code Editor
                </h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={copyCodeToClipboard}
                    className="px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
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
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
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
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analyzing Code...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Analyze Code
                </>
              )}
            </button>
          </form>

          {/* Results Section */}
          <div className="space-y-6">
            {!response ? (
              loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-pulse flex flex-col items-center">
                    <svg
                      className="w-16 h-16 text-blue-500 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <p className="text-lg text-gray-300">
                      Analyzing your code...
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      This may take a few moments
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center mb-6">
                    <svg
                      className="w-10 h-10 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Ready to Review
                  </h3>
                  <p className="text-sm text-gray-400 text-center max-w-md">
                    Paste your code above and click "Analyze Code" to get
                    instant feedback on bugs, security, and best practices
                  </p>
                </div>
              )
            ) : (
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-3">Summary</h2>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {response?.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bugs Section */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold">Bugs</h2>
                    <span className="ml-auto px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
                      {response?.bugs?.length || 0} found
                    </span>
                  </div>
                  {response?.bugs && response?.bugs.length !== 0 ? (
                    <div className="space-y-4">
                      {response.bugs.map((bug, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl bg-[#0f0f0f] border border-gray-800 hover:border-gray-700 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-base text-gray-200">
                              {bug.issue}
                            </h3>
                            <SeverityBadge severity={bug.severity} />
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {bug.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-8 h-8 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-400">
                        No bugs found! Your code looks clean.
                      </p>
                    </div>
                  )}
                </div>

                {/* Security Section */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold">Security Issues</h2>
                    <span className="ml-auto px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium">
                      {response?.security?.length || 0} found
                    </span>
                  </div>
                  {response?.security && response?.security.length !== 0 ? (
                    <div className="space-y-4">
                      {response.security.map((securityChild, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl bg-[#0f0f0f] border border-gray-800 hover:border-gray-700 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-base text-gray-200">
                              {securityChild.issue}
                            </h3>
                            <SeverityBadge severity={securityChild.severity} />
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {securityChild.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-8 h-8 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-400">
                        No security issues detected!
                      </p>
                    </div>
                  )}
                </div>

                {/* Best Practices Section */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold">Best Practices</h2>
                    <span className="ml-auto px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium">
                      {response?.bestPractices?.length || 0} suggestions
                    </span>
                  </div>
                  {response?.bestPractices &&
                  response?.bestPractices.length !== 0 ? (
                    <div className="space-y-4">
                      {response.bestPractices.map((bestPractice, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl bg-[#0f0f0f] border border-gray-800 hover:border-gray-700 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-base text-gray-200">
                              {bestPractice.issue}
                            </h3>
                            <SeverityBadge severity={bestPractice.severity} />
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {bestPractice.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-8 h-8 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-400">
                        Code follows best practices!
                      </p>
                    </div>
                  )}
                </div>

                {/* Improved Code Section */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold">Improved Code</h2>
                    </div>
                    <button
                      onClick={copyImprovedCodeToClipboard}
                      className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy Code
                    </button>
                  </div>
                  <div className="p-2">
                    <Editor
                      height="50vh"
                      defaultLanguage="javascript"
                      value={response?.improvedCode}
                      theme="vs-dark"
                      options={{
                        readOnly: true,
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
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
