import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HistoryReviewPage from "./layouts/HistoryReviewPage";
import HomePage from "./layouts/Homepage";
import HistoriesPage from "./layouts/HistoriesPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PublicReviewPage from "./layouts/PublicReviewPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoriesPage />} />
        <Route path="/history/:historyId" element={<HistoryReviewPage />} />
        <Route path="/share/:reviewId" element={<PublicReviewPage />} />
      </Routes>
    </>
  );
}

export default App;
