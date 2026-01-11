import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { generate } from "short-uuid";
import { toast, Toaster } from "react-hot-toast";

export default function Home() {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("// Write or paste your code\n");
  // const [language, setLanguage] = useState("");

  const editorRef = useRef(null);

  const handleMount = (editor) => {
    editorRef.current = editor;
  };
  const handleEditorChange = (value) => {
    setCode(value);
  };

  const getResponse = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if(!code) return toast.error("Code cannot be empty");
      setResponse();
      console.log("Getting response...");
      const { data } = await axios.post(
        "http://localhost:3000/api/ai/response",
        { code },
        {
          withCredentials: true,
        }
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
    } catch (err) {
      // backend-sent errors
      if (err?.response?.data?.error?.message) {
        toast.error(err.response.data.error.message);
        console.error(err.response.data.error.message);
        return;
      }
      // axios / network / timeout errors
      toast.error(err.message);
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCodeToClipboard = async () => {
    const demoCode = `function getUserData(req, res) {
const userId = req.query.id;
  if (userId) {
    const query = "SELECT * FROM users WHERE id = " + userId;
    database.execute(query, function (result) {
      res.send(result);
    });
  } else {
    res.send("User ID not provided");
  }
}`;
    try {
      await navigator.clipboard.writeText(demoCode);
      toast.success("Copied");
      console.log("Code copied!");
    } catch (err) {
      toast.error("Failed to copy");
      console.error("Failed to copy text: ", err);
    }
  };
  // const copyLanguageToClipboard = async () => {
  //   const demoLanguage = "JavaScript";
  //   try {
  //     await navigator.clipboard.writeText(demoLanguage);
  //     console.log("Language copied!");
  //   } catch (err) {
  //     console.error("Failed to copy text: ", err);
  //   }
  // };
  const copyImprovedCodeToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response.improvedCode);
      toast.success("Copied");
      console.log("Improved code copied!");
    } catch (err) {
      toast.error("Failed to copy");
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex flex-col p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-center text-4xl font-bold m-4">AI Code Reviewer</h1>
      <div className="flex justify-end">
        <Link to="/history">History</Link>
      </div>
      <form className="flex flex-col gap-2 my-4" onSubmit={getResponse}>
        <div className="">
          <h1 className="text-xl font-semibold">Code Editor</h1>
          <Editor
            height="50vh"
            defaultLanguage="java"
            value={code}
            onChange={handleEditorChange}
            onMount={handleMount}
            className="border rounded"
          />
        </div>
        {/* <div className="flex items-center">
          <h1 className="text-lg">Code Language</h1>
          <input
            type="text"
            className="border rounded mx-2 p-2"
            placeholder="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
          />
        </div> */}
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="border rounded-lg px-4 py-2 cursor-pointer bg-neutral-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get Response
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCode("");
            }}
            className="border rounded-lg px-4 py-2 cursor-pointer"
          >
            Clear Code
          </button>
        </div>
      </form>
      <div className="my-2 flex flex-row gap-2">
        <button
          onClick={copyCodeToClipboard}
          className="border rounded px-4 py-2 cursor-pointer"
        >
          Copy demo code to clipboard
        </button>
        {/* <button
          onClick={copyLanguageToClipboard}
          className="border rounded px-4 py-2 cursor-pointer"
        >
          Copy demo language to clipboard
        </button> */}
      </div>
      <div className="min-h-[50vh] my-4 py-2">
        {!response ? (
          loading ? (
            <p className="text-center text-lg">Getting response...</p>
          ) : (
            <p className="text-center text-lg">
              Write or paste your code above and get response
            </p>
          )
        ) : (
          <div>
            <br />
            <br />
            <div className="">
              <h1 className="font-bold text-2xl">Summary</h1>
              <p>{response?.summary}</p>
            </div>
            <br />
            <br />
            <div className="">
              <h1 className="font-bold text-2xl">Bugs</h1>
              <ul className="list-decimal mx-8">
                {response?.bugs && response?.bugs.length !== 0 ? (
                  <>
                    {response.bugs.map((bug, index) => (
                      <li className="" key={index}>
                        <p>
                          <span className="font-semibold">Issue</span> -{" "}
                          {bug.issue}
                        </p>
                        <p>
                          <span className="font-semibold">Severity</span> -{" "}
                          {bug.severity}
                        </p>
                        <p>
                          <span className="font-semibold">Explanation</span> -{" "}
                          {bug.explanation}
                        </p>
                      </li>
                    ))}
                  </>
                ) : (
                  <p>No Bugs found!</p>
                )}
              </ul>
            </div>
            <br />
            <br />
            <div className="">
              <h1 className="font-bold text-2xl">Security</h1>
              <ul className="list-decimal mx-8">
                {response?.security && response?.security.length !== 0 ? (
                  <>
                    {response.security.map((securityChild, index) => (
                      <li className="" key={index}>
                        <p>
                          <span className="font-semibold">Issue</span> -{" "}
                          {securityChild.issue}
                        </p>
                        <p>
                          <span className="font-semibold">Severity</span> -{" "}
                          {securityChild.severity}
                        </p>
                        <p>
                          <span className="font-semibold">Explanation</span> -{" "}
                          {securityChild.explanation}
                        </p>
                      </li>
                    ))}
                  </>
                ) : (
                  <p>No Security issue found!</p>
                )}
              </ul>
            </div>
            <br />
            <br />
            <div className="">
              <h1 className="font-bold text-2xl">Best Practices</h1>
              <ul className="list-decimal mx-8">
                {response?.bestPractices &&
                response?.bestPractices.length !== 0 ? (
                  <>
                    {response.bestPractices.map((bestPractice, index) => (
                      <li className="" key={index}>
                        <p>
                          <span className="font-semibold">Issue</span> -{" "}
                          {bestPractice.issue}
                        </p>
                        <p>
                          <span className="font-semibold">Severity</span> -{" "}
                          {bestPractice.severity}
                        </p>
                        <p>
                          <span className="font-semibold">Explanation</span> -{" "}
                          {bestPractice.explanation}
                        </p>
                      </li>
                    ))}
                  </>
                ) : (
                  <p>Code is written in best practices.</p>
                )}
              </ul>
            </div>
            <br />
            <br />

            <div className="">
              <div className="flex gap-8 my-4">
                <h1 className="font-bold text-2xl">Improved Code</h1>
                <button
                  onClick={copyImprovedCodeToClipboard}
                  className="border rounded px-4 py-2 cursor-pointer"
                >
                  Copy improved code to clipboard
                </button>
              </div>
              <Editor
                height="50vh"
                defaultLanguage="javascript"
                defaultValue={response?.improvedCode}
                className="border rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
