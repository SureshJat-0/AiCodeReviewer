import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import HistoryReviewPage from "./layouts/HistoryReviewPage";
import HomePage from "./layouts/Homepage";
import HistoriesPage from "./layouts/HistoriesPage";
import ReviewUpload from "./components/ReviewUpload";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<ReviewUpload />} />
          <Route path="/history" element={<HistoriesPage />} />
          <Route path="/history/:historyId" element={<HistoryReviewPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
