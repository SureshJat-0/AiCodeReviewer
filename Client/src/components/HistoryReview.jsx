import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import {
  HiExclamation,
  HiLockClosed,
  HiShieldCheck,
  HiBadgeCheck,
  HiCheckCircle,
  HiDocumentText,
} from "react-icons/hi";
import { FiCode, FiCheck, FiChevronLeft } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function HistoryReview() {
  const [historyItem, setHistoryItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const { historyId } = useParams();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const historyState = location?.state?.history;
    if (historyState) {
      setHistoryItem(historyState);
      setLoading(false);
      return;
    }
    const storedHistory = localStorage.getItem("history");
    if (!storedHistory) {
      setLoading(false);
      return;
    }
    try {
      const parsedHistory = JSON.parse(storedHistory);
      if (Array.isArray(parsedHistory)) {
        const history = parsedHistory.find((h) => h.id === historyId);
        setHistoryItem(history || null);
      }
    } catch (err) {
      setHistoryItem(null);
    }
    setLoading(false);
  }, [historyId, location.state]);

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

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen bg-[#0f0f0f] text-gray-100">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center animate-pulse">
            <AiOutlineLoading3Quarters className="w-10 h-10 text-blue-400 animate-spin" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Loading Review
            </h2>
            <p className="text-gray-400">
              Please wait while we fetch your review...
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (!historyItem) {
    return (
      <div className="text-center flex-1 my-auto">
        <div className="w-20 h-20 rounded-2xl bg-red-600/20 border border-red-600/30 flex items-center justify-center mx-auto mb-6">
          <HiExclamation className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No History Found</h3>
        <p className="text-sm text-gray-400 mb-6">
          The requested review doesn't exist.
        </p>
        <Link
          to="/history"
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors inline-flex items-center gap-2"
        >
          <FiChevronLeft className="w-4 h-4" />
          Back to History
        </Link>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
              Review Details
            </h1>
            <p className="text-sm text-gray-400">
              {new Date(historyItem.timestamp).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Link
            to="/history"
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors flex items-center gap-2"
          >
            <FiChevronLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

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
                  {historyItem.output?.summary}
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
                {historyItem.output?.bugs?.length || 0} found
              </span>
            </div>
            {historyItem.output?.bugs &&
            historyItem.output?.bugs.length !== 0 ? (
              <div className="space-y-4">
                {historyItem.output.bugs.map((bug, index) => (
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
                {historyItem.output?.security?.length || 0} found
              </span>
            </div>
            {historyItem.output?.security &&
            historyItem.output?.security.length !== 0 ? (
              <div className="space-y-4">
                {historyItem.output.security.map((securityChild, index) => (
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
                {historyItem.output?.bestPractices?.length || 0} suggestions
              </span>
            </div>
            {historyItem.output?.bestPractices &&
            historyItem.output?.bestPractices.length !== 0 ? (
              <div className="space-y-4">
                {historyItem.output.bestPractices.map((bestPractice, index) => (
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

          {/* Code Comparison Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Code */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                  <FiCode className="w-5 h-5 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold">Original Code</h2>
              </div>
              <div className="p-2">
                <Editor
                  height="60vh"
                  defaultLanguage="javascript"
                  value={historyItem?.input}
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

            {/* Improved Code */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <HiCheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-xl font-bold">Improved Code</h2>
              </div>
              <div className="p-2">
                <Editor
                  height="60vh"
                  defaultLanguage="javascript"
                  value={historyItem.output?.improvedCode}
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
        </div>
      </div>
    </main>
  );
}
