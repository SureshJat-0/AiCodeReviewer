import Aside from "../components/aside";
import Review from "../components/Review";

export default function HomePage() {
  return (
    <div className="flex h-screen bg-[#0f0f0f] text-gray-100">
      <Aside />
      <Review />
    </div>
  );
}
