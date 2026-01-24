import { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { generate } from "short-uuid";
import { toast } from "react-hot-toast";
import { FiCode, FiCopy, FiTrash2 } from "react-icons/fi";
import { HiLightningBolt } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ResultSection from "./ResultSection";
import { FaFileUpload } from "react-icons/fa";

export default function Home() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [githubUrl, setGithubUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [code, setCode] = useState(
    "// Paste your code here to get an AI review\n",
  );

  const editorRef = useRef(null);

  const handleMount = (editor) => {
    editorRef.current = editor;
  };
  const handleEditorChange = (value) => {
    setCode(value);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
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
      toast.success("Sample code copied to your clipboard.");
      console.log("Code copied!");
    } catch (err) {
      toast.error("Couldn't copy to clipboard. Please try again.");
      console.error("Failed to copy text: ", err);
    }
  };

  const getAiResponse = async (e, code) => {
    try {
      e.preventDefault();
      setLoading(true);
      if (!code) return toast.error("Add code before requesting a review.");
      setResponse();
      console.log("Getting response...");
      const { data } = await axios.post(
        "http://localhost:3000/api/ai/response",
        { code },
        {
          withCredentials: true,
        },
      );
      if (data?.error) {
        throw new Error("AI service failed. Please try again later.");
      }
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

  const uploadCodeToReview = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // const file = e.target.file.files[0];
      if (!selectedFile) {
        toast.error("Select a file to review.");
        console.log("No file is provided!");
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await axios.post(
        "http://localhost:3000/api/ai/upload",
        formData,
        { withCredentials: true },
      );
      const codeToReview = response.data.content;
      if (!codeToReview) {
        toast.error("We couldn't read that file.");
        setLoading(false);
        return;
      }
      if (!codeToReview.trim()) {
        toast.error("The uploaded file is empty.");
        setLoading(false);
        return;
      }
      setCode(codeToReview);
      getAiResponse(e, codeToReview);
    } catch (err) {
      toast.error("We couldn't read your file. Please try again.");
      console.log(err);
      setLoading(false);
    }
  };

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
        toast.error("Paste a GitHub file URL to review.");
        setLoading(false);
        return;
      }
      const { owner, repo, branch, path } = parseGithubBlobUrl(githubUrl);
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
      const response = await axios.get(url);
      const codeToReview = decodeBase64ToUtf8(response.data.content);
      setCode(codeToReview);
      getAiResponse(e, codeToReview);
    } catch (err) {
      console.log(err);
      if (err.status === 404) toast.error("File not found on GitHub.");
      else toast.error(err.message);
      setResponse();
      setGithubUrl("");
      setLoading(false);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 0: // Paste code Tab
        return (
          <form
            onSubmit={(e) => getAiResponse(e, code)}
            className="space-y-6 mb-8"
          >
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <FiCode className="w-5 h-5 text-blue-400" />
                  Code Workspace
                </h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={copyCodeToClipboard}
                    className="px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-2"
                  >
                    <FiCopy className="w-4 h-4" />
                    Load sample
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
                    Clear editor
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
              className="w-full px-6 py-3 cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md"
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                  Reviewing code...
                </>
              ) : (
                <>
                  <HiLightningBolt className="w-5 h-5" />
                  Run Review
                </>
              )}
            </button>
          </form>
        );
      case 1: // Upload file Tab
        return (
          <form
            onSubmit={uploadCodeToReview}
            encType="multipart/form-data"
            className="space-y-6 mb-8"
          >
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden shadow-lg">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <FaFileUpload className="w-5 h-5 text-blue-400" />
                  Upload a code file
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full py-8 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:bg-[#141414] transition-colors group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaFileUpload className="w-12 h-12 text-gray-500 group-hover:text-blue-400 transition-colors mb-2" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold group-hover:text-blue-400 transition-colors">
                          Click to upload
                        </span>{" "}
                        or drag and drop your file
                      </p>
                      {selectedFile ? (
                        <p className="text-sm text-gray-100 mt-2">
                          Selected file:{" "}
                          <span className="font-medium">
                            {selectedFile.name}
                          </span>
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">
                          Supported formats: .js, .jsx, .ts, .tsx, .py, .java,
                          .cpp, .c, .go, .rb, .php, etc...
                        </p>
                      )}
                    </div>
                    <input
                      type="file"
                      name="file"
                      className="hidden"
                      onChange={handleFileChange}
                      // accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.rb,.php,.txt"
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md"
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                  Reviewing code...
                </>
              ) : (
                <>
                  <HiLightningBolt className="w-5 h-5" />
                  Run Review
                </>
              )}
            </button>
          </form>
        );
      case 2: // GitHub url Tab
        return (
          <form onSubmit={readGithubFile} className="space-y-6 mb-8">
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden shadow-lg">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <FiCode className="w-5 h-5 text-blue-400" />
                  Review from GitHub
                </h2>
              </div>
              <div className="p-6">
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="GitHub file URL, e.g., https://github.com/:owner/:repo/blob/:branch/:path"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Paste a direct GitHub blob URL to review a specific file
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md"
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                  Reviewing code...
                </>
              ) : (
                <>
                  <HiLightningBolt className="w-5 h-5" />
                  Run Review
                </>
              )}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
              AI Code Review Studio
            </h1>
            <p className="text-sm text-gray-400">
              Get AI-powered reviews for bugs, security, and best practices
            </p>
          </div>

          <div className="mb-8 border-b border-gray-700">
            <nav className="flex gap-1">
              <button
                onClick={() => setActiveTab(0)}
                className={`px-6 py-4 cursor-pointer text-sm font-medium transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 0
                    ? "text-blue-400 border-blue-400"
                    : "text-gray-400 border-transparent hover:text-gray-300"
                }`}
              >
                <FiCopy className="w-5 h-5" />
                Paste code
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={`px-6 py-4 cursor-pointer text-sm font-medium transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 1
                    ? "text-blue-400 border-blue-400"
                    : "text-gray-400 border-transparent hover:text-gray-300"
                }`}
              >
                <FaFileUpload className="w-5 h-5" />
                Upload file
              </button>
              <button
                onClick={() => setActiveTab(2)}
                className={`px-6 py-4 cursor-pointer text-sm font-medium transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 2
                    ? "text-blue-400 border-blue-400"
                    : "text-gray-400 border-transparent hover:text-gray-300"
                }`}
              >
                <FiCode className="w-5 h-5" />
                GitHub file
              </button>
            </nav>
          </div>

          {/* rendering form according to tab */}
          {renderTab()}

          <ResultSection
            response={response}
            loading={loading}
            originalCode={null}
          />
        </div>
      </main>
    </>
  );
}
