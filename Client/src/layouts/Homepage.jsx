import React from "react";
import Aside from "../components/aside";
import Home from "../components/Review";

export default function Homepage() {
  return (
    <div className="flex h-screen bg-[#0f0f0f] text-gray-100">
      <Aside />
      <Home />
    </div>
  );
}
