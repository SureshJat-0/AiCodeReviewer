import axios from "axios";
import Aside from "./aside";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { toast } from "react-hot-toast";
import { FiCode, FiCopy, FiCheck } from "react-icons/fi";
import {
  HiLightBulb,
  HiDocumentText,
  HiExclamation,
  HiLockClosed,
  HiShieldCheck,
  HiBadgeCheck,
  HiCheckCircle,
} from "react-icons/hi";

export default function ReviewUpload() {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);

  const uploadCodeToReview = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.file.files[0];
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        "http://localhost:3000/api/ai/upload",
        formData,
        { withCredentials: true },
      );
      const codeToReview = response.data.content;
      getAiResponse(codeToReview);
    } catch (err) {
      console.log(err);
    }
  };

  const getAiResponse = async (code) => {
    try {
      console.log(code);
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
    } catch (error) {
      console.log(error);
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
      <Aside />
      {/* main content  */}
      <main className="flex-1 overflow-auto">
        <form
          onSubmit={uploadCodeToReview}
          encType="multipart/form-data"
          className="p-8 m-4 border rounded"
        >
          <input type="file" name="file" className="text-lg my-4" />
          <br />
          <button
            type="submit"
            className="px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-2"
          >
            Review
          </button>
        </form>

        {/* result section  */}
        <div className="space-y-6">
          {!response ? (
            loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-pulse flex flex-col items-center">
                  <HiLightBulb className="w-16 h-16 text-blue-500 mb-4" />
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
                  <FiCode className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Review</h3>
                <p className="text-sm text-gray-400 text-center max-w-md">
                  Paste your code above and click "Analyze Code" to get instant
                  feedback on bugs, security, and best practices
                </p>
              </div>
            )
          ) : (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                    <HiDocumentText className="w-5 h-5 text-blue-400" />
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
                    <HiExclamation className="w-5 h-5 text-red-400" />
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
                      <FiCheck className="w-8 h-8 text-green-400" />
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
                    <HiLockClosed className="w-5 h-5 text-yellow-400" />
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
                      <HiShieldCheck className="w-8 h-8 text-green-400" />
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
                    <HiBadgeCheck className="w-5 h-5 text-purple-400" />
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
                      <FiCheck className="w-8 h-8 text-green-400" />
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
                      <HiCheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <h2 className="text-xl font-bold">Improved Code</h2>
                  </div>
                  <button
                    onClick={copyImprovedCodeToClipboard}
                    className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors flex items-center gap-2"
                  >
                    <FiCopy className="w-4 h-4" />
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
      </main>
    </div>
  );
}
