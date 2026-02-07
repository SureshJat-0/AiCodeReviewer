import Aside from "../components/aside";
import PublicReview from "../pages/PublicReview";

export default function PublicReviewPage() {
  return (
    <div className="flex h-screen bg-[#0f0f0f] text-gray-100">
      <Aside />
      <PublicReview />
    </div>
  );
}
