import Aside from "../components/aside";
import GitHubLinkReview from "../components/GitHubLinkReview";

export default function GitHubLinkReviewPage() {
  return (
    <div className="flex h-screen bg-[#0f0f0f] text-gray-100">
      <Aside />
      <GitHubLinkReview />
    </div>
  );
}
