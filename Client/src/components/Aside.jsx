import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
import {
  FiCode,
  FiChevronsLeft,
  FiChevronsRight,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { MdHistory } from "react-icons/md";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { useAuth } from "../contexts/auth";

export default function Aside() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const updateViewportState = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    updateViewportState();
    window.addEventListener("resize", updateViewportState);

    return () => window.removeEventListener("resize", updateViewportState);
  }, []);

  return (
    <>
      {isMobile && (
        <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-gray-800/50 bg-[#141414] px-4 md:hidden">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-600">
              <span className="text-xs font-bold text-white">AI</span>
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-medium text-gray-200">
                Code Review
              </h2>
              <p className="truncate text-[11px] text-gray-500">
                AI code analysis
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen((value) => !value)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-800/70 bg-[#1a1a1a] text-gray-200 transition-colors hover:bg-[#222222]"
          >
            {sidebarOpen ? (
              <FiX className="h-5 w-5" />
            ) : (
              <FiMenu className="h-5 w-5" />
            )}
          </button>
        </header>
      )}

      {isMobile && sidebarOpen && (
        <div className="fixed inset-x-0 top-16 z-40 rounded-b-2xl border-b border-gray-800/50 bg-[#141414] shadow-2xl md:hidden">
          <div className="px-4 py-3">
            <nav className="space-y-2">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                aria-label="New Review"
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  location.pathname === "/"
                    ? "bg-[#1e1e1e] text-gray-100"
                    : "bg-[#161616] text-gray-300 hover:bg-[#1e1e1e]"
                }`}
              >
                <FiCode className="h-4 w-4" />
                New Review
              </Link>

              <Link
                to="/history"
                onClick={() => setSidebarOpen(false)}
                aria-label="History"
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  location.pathname === "/history"
                    ? "bg-[#1e1e1e] text-gray-100"
                    : "bg-[#161616] text-gray-300 hover:bg-[#1e1e1e]"
                }`}
              >
                <MdHistory className="h-4 w-4" />
                History
              </Link>
            </nav>

            <div className="mt-3 border-t border-gray-800/50 pt-3">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setSidebarOpen(false);
                  }}
                  aria-label="Sign Out"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                  <BiLogOut className="h-4 w-4" />
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Sign In"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                  <BiLogIn className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <aside
        className={`${
          isMobile ? "hidden" : sidebarOpen ? "w-56" : "w-14"
        } bg-[#141414] border-r border-gray-800/50 flex flex-col transition-all duration-300`}
      >
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#f3f4f6",
              border: "1px solid #374151",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#1a1a1a",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#1a1a1a",
              },
            },
          }}
        />

        <div className="hidden items-center justify-between gap-3 border-b border-gray-800/50 p-3 md:flex">
          {sidebarOpen ? (
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-600">
                <span className="text-xs font-bold text-white">AI</span>
              </div>
              <h2 className="truncate text-sm font-medium text-gray-200">
                Code Review
              </h2>
            </div>
          ) : (
            <div className="mx-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-600">
              <span className="text-xs font-bold text-white">AI</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setSidebarOpen((value) => !value)}
            className={`rounded-md p-1.5 transition-colors hover:bg-[#1e1e1e] ${
              !sidebarOpen ? "hidden" : ""
            }`}
            aria-label="Toggle sidebar"
          >
            <FiChevronsLeft className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3 pt-2">
          <Link
            to="/"
            aria-label="New Review"
            title={sidebarOpen ? undefined : "New Review"}
            className={`flex w-full items-center gap-2.5 rounded-md transition-colors ${
              location.pathname === "/"
                ? "bg-[#1e1e1e] text-gray-300"
                : "text-gray-400 hover:bg-[#1e1e1e] hover:text-gray-300"
            } ${sidebarOpen ? "px-3 py-2" : "justify-center p-2"}`}
          >
            <FiCode className="h-4 w-4" />
            {sidebarOpen && <span className="text-sm">New Review</span>}
          </Link>

          <Link
            to="/history"
            aria-label="History"
            title={sidebarOpen ? undefined : "History"}
            className={`flex w-full items-center gap-2.5 rounded-md transition-colors ${
              location.pathname === "/history"
                ? "bg-[#1e1e1e] text-gray-300"
                : "text-gray-400 hover:bg-[#1e1e1e] hover:text-gray-300"
            } ${sidebarOpen ? "px-3 py-2" : "justify-center p-2"}`}
          >
            <MdHistory className="h-4 w-4" />
            {sidebarOpen && <span className="text-sm">History</span>}
          </Link>

          {!sidebarOpen && !isMobile && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Expand Sidebar"
              title="Expand Sidebar"
              className="flex w-full items-center justify-center rounded-md p-2 text-gray-400 transition-colors hover:bg-[#1e1e1e] hover:text-gray-300"
            >
              <FiChevronsRight className="h-4 w-4" />
            </button>
          )}
        </nav>

        {sidebarOpen && (
          <div className="border-t border-gray-800/50 p-3">
            {user ? (
              <button
                type="button"
                onClick={logout}
                aria-label="Sign Out"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              >
                <BiLogOut className="h-4 w-4" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                aria-label="Sign In"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              >
                <BiLogIn className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
