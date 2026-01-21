import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiPlus } from "react-icons/fi";
import { MdHistory } from "react-icons/md";
import { HiDocumentText } from "react-icons/hi";

export default function Histories() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);

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
              <MdHistory className="w-16 h-16 text-blue-500 mb-4" />
              <p className="text-lg text-gray-300">Loading history...</p>
            </div>
          </div>
        ) : !history || history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center mb-6">
              <MdHistory className="w-10 h-10 text-blue-400" />
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
              <FiPlus className="w-4 h-4" />
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
                        <HiDocumentText className="w-4 h-4 text-blue-400" />
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
                    <FiChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0 ml-4" />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <MdHistory className="w-3.5 h-3.5" />
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
  );
}
