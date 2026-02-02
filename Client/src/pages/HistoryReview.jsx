import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { HiExclamation } from "react-icons/hi";
import { FiChevronLeft } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ResultSection from "../components/ResultSection";

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

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen bg-[#0f0f0f] text-gray-100">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center animate-pulse">
            <AiOutlineLoading3Quarters className="w-10 h-10 text-blue-400 animate-spin" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Loading review
            </h2>
            <p className="text-gray-400">
              Hang tight while we load your review.
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
        <h3 className="text-xl font-semibold mb-2">Review not found</h3>
        <p className="text-sm text-gray-400 mb-6">
          We couldn't find that review.
        </p>
        <Link
          to="/history"
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors inline-flex items-center gap-2"
        >
          <FiChevronLeft className="w-4 h-4" />
          Back to history
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

        <ResultSection
          response={historyItem?.output}
          loading={loading}
          originalCode={historyItem?.input}
        />
      </div>
    </main>
  );
}
