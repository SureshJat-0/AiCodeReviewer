import Aside from "../components/Aside";
import PublicReview from "../pages/PublicReview";

export default function PublicReviewPage() {
  return (
    <div className="flex h-screen flex-col md:flex-row bg-[#0f0f0f] text-gray-100 pt-16 md:pt-0">
      <Aside />
      <PublicReview />
    </div>
  );
}
