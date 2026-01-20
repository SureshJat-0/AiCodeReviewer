import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

export default function History() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getHistory = () => {
    setLoading(true);
    const history = JSON.parse(localStorage.getItem("history")) || null;
    setHistory(history);
    setLoading(false);
  };

  useEffect(() => {
    getHistory();
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

          <button
            onClick={() => !sidebarOpen && setSidebarOpen(true)}
            aria-label="History"
            title={sidebarOpen ? undefined : "History"}
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {sidebarOpen && (
              <span className="text-sm font-medium">History</span>
            )}
          </button>

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
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
              Review History
            </h1>
            <p className="text-sm text-gray-400">
              View your previous code reviews and analyses
            </p>
          </div>

          {loading ? (
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-lg text-gray-300">Loading history...</p>
              </div>
            </div>
          ) : !history || history.length === 0 ? (
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No History Yet</h3>
              <p className="text-sm text-gray-400 text-center max-w-md mb-6">
                You haven't reviewed any code yet. Start by analyzing your first
                code snippet.
              </p>
              <Link
                to="/"
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors flex items-center gap-2"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create New Review
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {[...history].reverse().map((e, index) => (
                <Link
                  to={`/history/${e.id}`}
                  state={{ history: e }}
                  key={index}
                  className="block"
                >
                  <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-5 hover:border-gray-700 hover:bg-[#1e1e1e] transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-9 h-9 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0 group-hover:bg-blue-600/30 transition-colors">
                          <svg
                            className="w-4 h-4 text-blue-400"
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
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-200 mb-2 group-hover:text-white transition-colors">
                            Code Review #{history.length - index}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                            {e.output.summary}
                          </p>
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0 ml-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-3.5 h-3.5"
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
                        {formatDate(e.timestamp)}
                      </div>
                      {e.output.bugs && e.output.bugs.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          {e.output.bugs.length} bugs
                        </div>
                      )}
                      {e.output.security && e.output.security.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                          {e.output.security.length} security issues
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
