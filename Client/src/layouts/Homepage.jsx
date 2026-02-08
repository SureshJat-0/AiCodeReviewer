import Aside from "../components/Aside";
import Review from "../pages/Review";

export default function HomePage() {
  return (
    <div className="flex h-screen bg-[#0f0f0f] text-gray-100">
      <Aside />
      <Review />
    </div>
  );
}
