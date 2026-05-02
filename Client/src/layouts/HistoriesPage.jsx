import Histories from "../pages/Histories";
import Aside from "../components/Aside";

export default function HistoriesPage() {
  return (
    <div className="flex h-screen flex-col md:flex-row bg-[#0f0f0f] text-gray-100 pt-16 md:pt-0">
      <Aside />
      <Histories />
    </div>
  );
}
