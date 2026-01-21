import Histories from "../components/Histories";
import Aside from "../components/aside";

export default function HistoriesPage() {
  return (
    <div className="flex h-screen bg-[#0f0f0f] text-gray-100">
      <Aside />
      <Histories />
    </div>
  );
}
