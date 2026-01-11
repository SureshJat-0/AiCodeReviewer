import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function History() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);

  const getHistory = () => {
    setLoading(true);
    const history = JSON.parse(localStorage.getItem("history")) || null;
    setHistory(history);
    setLoading(false);
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-center text-4xl font-bold m-4">History</h1>
      <div className="flex justify-end">
        <Link to="/">Home</Link>
      </div>
      <div className="my-4">
        {loading ? (
          <p>Loading...</p>
        ) : !history ? (
          <h1>No history</h1>
        ) : (
          <ul className="list-decimal mx-8">
            {history.map((e, index) => (
              <Link to={`/history/${e.id}`} state={{ history: e }} key={index}>
                <li className="my-4">
                  <span className="font-semibold">Summary - </span>
                  {e.output.summary}
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
