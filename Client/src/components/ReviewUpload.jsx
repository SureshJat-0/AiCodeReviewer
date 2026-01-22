import axios from "axios";
import Aside from "./Aside";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ResultSection from "./ResultSection";
import { Link, useLocation } from "react-router-dom";
import { generate } from "short-uuid";

export default function ReviewUpload() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const uploadCodeToReview = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const file = e.target.file.files[0];
      if (!file) {
        toast.error("Choose file to review");
        console.log("No file is provided!");
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        "http://localhost:3000/api/ai/upload",
        formData,
        { withCredentials: true },
      );
      const codeToReview = response.data.content;
      if (!codeToReview) {
        toast.error("Error while generating response");
        setLoading(false);
        return;
      }
      if (!codeToReview.trim()) {
        toast.error("Code can not be empty");
        setLoading(false);
        return;
      }
      getAiResponse(codeToReview);
    } catch (err) {
      toast.error("Some error occered while reading your file");
      console.log(err);
      setLoading(false);
    }
  };

  const getAiResponse = async (code) => {
    try {
      setLoading(true);
      if (!code) {
        toast.error("Code cannot be empty");
        setLoading(false);
        return;
      }
      setResponse();
      console.log("Getting response...");
      const { data } = await axios.post(
        "http://localhost:3000/api/ai/response",
        { code },
        {
          withCredentials: true,
        },
      );
      setResponse(data);
      // adding history in local storage
      const history = JSON.parse(localStorage.getItem("history")) || [];
      const historyItem = {
        input: code,
        output: data,
        id: generate(),
        timestamp: Date.now(),
      };
      const updatedHistory = [...history, historyItem];
      localStorage.setItem("history", JSON.stringify(updatedHistory));
      console.log("Get response success");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto flex h-screen bg-[#0f0f0f] text-gray-100">
      <Aside />
      {/* main content */}
      <main className="flex-1 overflow-auto max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
            AI Code Reviewer
          </h1>
          <p className="text-sm text-gray-400">
            Analyze your code for bugs, security issues, and best practices
          </p>
        </div>

        <div className="flex">
          <Link
            to="/"
            className="m-4 px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-2"
          >
            Paste your code
          </Link>
          <Link
            to="/upload"
            className="m-4 px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-2"
          >
            Upload file
          </Link>
          <Link
            to="/github"
            className="m-4 px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-2"
          >
            GitHub link
          </Link>
        </div>

        <form
          onSubmit={uploadCodeToReview}
          encType="multipart/form-data"
          className="p-8 m-4 border rounded"
        >
          <input type="file" name="file" className="text-lg my-4" />
          <br />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Review
          </button>
        </form>

        {/* result section */}
        <ResultSection response={response} loading={loading} />
      </main>
    </div>
  );
}
