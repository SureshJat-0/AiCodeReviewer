import React from "react";
import Aside from "../components/aside";
import HistoryReview from "../components/HistoryReview";

export default function HistoryReviewPage() {
  return (
    <div className="flex h-screen bg-[#0f0f0f] text-gray-100">
      <Aside />
      <HistoryReview />
    </div>
  );
}
