import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

export default function HistoryReview() {
  const [historyItem, setHistoryItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { historyId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const historyState = location?.state?.history;
    if (historyState) {
      setHistoryItem(historyState);
      return;
    }
    const storedHistory = localStorage.getItem("history");
    if (!storedHistory) return;
    try {
      const parsedHistory = JSON.parse(storedHistory);
      if (Array.isArray(parsedHistory)) {
        const history = parsedHistory.find((h) => h.id === historyId);
        setHistoryItem(history || null);
      }
    } catch (err) {
      setHistoryItem(null);
    }
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

  if (!historyItem) {
    return (
      <div className="flex h-screen bg-[#0f0f0f] text-gray-100 items-center justify-center">
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
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-red-600/20 border border-red-600/30 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-400"
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
          <h3 className="text-xl font-semibold mb-2">No History Found</h3>
          <p className="text-sm text-gray-400 mb-6">
            The requested review doesn't exist.
          </p>
          <Link
            to="/history"
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors inline-flex items-center gap-2"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-gray-100">
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
          <Link
            to="/"
            aria-label="New Review"
            title={sidebarOpen ? undefined : "New Review"}
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
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            {sidebarOpen && <span className="text-sm">New Review</span>}
          </Link>

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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </Link>
          </div>

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
                    {historyItem.output?.summary}
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
                  {historyItem.output?.bestPractices?.length || 0} suggestions
                </span>
              </div>
              {historyItem.output?.bestPractices &&
              historyItem.output?.bestPractices.length !== 0 ? (
                <div className="space-y-4">
                  {historyItem.output.bestPractices.map(
                    (bestPractice, index) => (
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
                    ),
                  )}
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

            {/* Code Comparison Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original Code */}
              <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
    </div>
  );
}
