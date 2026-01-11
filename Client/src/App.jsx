import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import History from "./History";
import HistoryReview from "./HistoryReview";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/history/:historyId" element={<HistoryReview />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
