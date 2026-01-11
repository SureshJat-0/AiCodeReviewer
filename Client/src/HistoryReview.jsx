import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export default function HistoryReview() {
  const [historyItem, setHistoryItem] = useState(null);
  const { historyId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const historyState = location?.state?.history;
    if (historyState) {
      setHistoryItem(historyState);
      return;
    }
    const storedHistory = localStorage.getItem("history");
    if (!storedHistory) return;
    try {
      const parsedHistory = JSON.parse(storedHistory);
      if (Array.isArray(parsedHistory)) {
        const history = parsedHistory.find((h) => h.id === historyId);
        setHistoryItem(history || null);
      }
    } catch (err) {
      setHistoryItem(null);
    }
  }, [historyId, location.state]);

  if (!historyItem) return <h1>No history found!</h1>;
  else
    return (
      <div className="flex flex-col p-4">
        <div>HistoryReview</div>
        <div className="">
          <div>
            <br />
            <br />
            <div className="">
              <h1 className="font-bold text-2xl">Summary</h1>
              <p>{historyItem.output?.summary}</p>
            </div>
            <br />
            <br />
            <div className="">
              <h1 className="font-bold text-2xl">Bugs</h1>
              <ul className="list-decimal mx-8">
                {historyItem.output?.bugs && historyItem.output?.bugs.length !== 0 ? (
                  <>
                    {historyItem.output.bugs.map((bug, index) => (
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
                {historyItem.output?.security && historyItem.output?.security.length !== 0 ? (
                  <>
                    {historyItem.output.security.map((securityChild, index) => (
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
                {historyItem.output?.bestPractices &&
                historyItem.output?.bestPractices.length !== 0 ? (
                  <>
                    {historyItem.output.bestPractices.map((bestPractice, index) => (
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

            <div className="flex justify-around">
              <div className="">
                <div className="flex gap-8 my-4">
                  <h1 className="font-bold text-2xl">Improved Code</h1>
                </div>
                <Editor
                  height="50vh"
                  width="45vw"
                  defaultLanguage="javascript"
                  defaultValue={historyItem.output?.improvedCode}
                  className="border rounded"
                />
              </div>
              <div className="">
                <div className="flex gap-8 my-4">
                  <h1 className="font-bold text-2xl">Original Code</h1>
                </div>
                <Editor
                  height="50vh"
                  width="45vw"
                  defaultLanguage="javascript"
                  defaultValue={historyItem?.input}
                  className="border rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
