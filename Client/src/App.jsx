import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Homepage from "./layouts/Homepage";
import Histories from "./layouts/Histories";
import HistoryReviewPage from "./layouts/HistoryReviewPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/history" element={<Histories />} />
          <Route path="/history/:historyId" element={<HistoryReviewPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
