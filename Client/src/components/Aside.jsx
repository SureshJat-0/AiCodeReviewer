import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FiCode, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { MdHistory } from "react-icons/md";
import { BiLogIn } from "react-icons/bi";

export default function Aside() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <aside
      className={`${sidebarOpen ? "w-56" : "w-14"} bg-[#141414] border-r border-gray-800/50 transition-all duration-300 flex flex-col`}
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
      <div className="p-3 border-b border-gray-800/50 flex items-center justify-between">
        {sidebarOpen ? (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <h2 className="font-medium text-sm text-gray-200">Code Review</h2>
          </div>
        ) : (
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xs">AI</span>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-1.5 hover:bg-[#1e1e1e] rounded-md transition-colors ${!sidebarOpen && "hidden"}`}
        >
          <FiChevronsLeft className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 mt-2">
        <Link
          to="/"
          aria-label="New Review"
          title={sidebarOpen ? undefined : "New Review"}
          className={`w-full flex items-center gap-2.5 rounded-md text-gray-400 hover:bg-[#1e1e1e] hover:text-gray-300 transition-colors ${sidebarOpen ? "px-3 py-2" : "p-2 justify-center"}`}
        >
          <FiCode className="w-4 h-4" />
          {sidebarOpen && <span className="text-sm">New Review</span>}
        </Link>

        <Link
          to="/history"
          aria-label="History"
          title={sidebarOpen ? undefined : "History"}
          className={`w-full flex items-center gap-2.5 rounded-md text-gray-400 hover:bg-[#1e1e1e] hover:text-gray-300 transition-colors ${sidebarOpen ? "px-3 py-2" : "p-2 justify-center"}`}
        >
          <MdHistory className="w-4 h-4" />
          {sidebarOpen && <span className="text-sm">History</span>}
        </Link>

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Expand Sidebar"
            title="Expand Sidebar"
            className="w-full flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-[#1e1e1e] hover:text-gray-300 transition-colors"
          >
            <FiChevronsRight className="w-4 h-4" />
          </button>
        )}
      </nav>

      {sidebarOpen && (
        <div className="p-3 border-t border-gray-800/50">
          <Link
            to="/login"
            aria-label="Sign In"
            className="w-full px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors flex items-center gap-2 justify-center"
          >
            <BiLogIn className="w-4 h-4" />
            Sign In
          </Link>
        </div>
      )}
    </aside>
  );
}

/**
 
 <aside
         className={`${sidebarOpen ? "w-56" : "w-14"} bg-[#141414] border-r border-gray-800/50 transition-all duration-300 flex flex-col`}
       >
         <div className="p-3 border-b border-gray-800/50 flex items-center justify-between">
           {sidebarOpen ? (
             <div className="flex items-center gap-2.5">
               <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
                 <span className="text-white font-bold text-xs">AI</span>
               </div>
               <h2 className="font-medium text-sm text-gray-200">Code Review</h2>
             </div>
           ) : (
             <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center mx-auto">
               <span className="text-white font-bold text-xs">AI</span>
             </div>
           )}
           <button
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className={`p-1.5 hover:bg-[#1e1e1e] rounded-md transition-colors ${!sidebarOpen && "hidden"}`}
           >
             <FiChevronsLeft className="w-4 h-4 text-gray-400" />
           </button>
         </div>
 
         <nav className="flex-1 p-3 space-y-1 mt-2">
           <Link
             to="/"
             aria-label="New Review"
             title={sidebarOpen ? undefined : "New Review"}
             className={`w-full flex items-center gap-2.5 rounded-md text-gray-400 hover:bg-[#1e1e1e] hover:text-gray-300 transition-colors ${sidebarOpen ? "px-3 py-2" : "p-2 justify-center"}`}
           >
             <FiCode className="w-4 h-4" />
             {sidebarOpen && <span className="text-sm">New Review</span>}
           </Link>
 
           <button
             onClick={() => !sidebarOpen && setSidebarOpen(true)}
             aria-label="History"
             title={sidebarOpen ? undefined : "History"}
             className={`w-full flex items-center gap-2.5 rounded-md bg-[#1e1e1e] text-gray-300 hover:bg-[#252525] transition-colors ${sidebarOpen ? "px-3 py-2" : "p-2 justify-center"}`}
           >
             <MdHistory className="w-4 h-4" />
             {sidebarOpen && (
               <span className="text-sm font-medium">History</span>
             )}
           </button>
 
           {!sidebarOpen && (
             <button
               onClick={() => setSidebarOpen(true)}
               aria-label="Expand Sidebar"
               title="Expand Sidebar"
               className="w-full flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-[#1e1e1e] hover:text-gray-300 transition-colors"
             >
               <FiChevronsRight className="w-4 h-4" />
             </button>
           )}
         </nav>
 
         {sidebarOpen && (
           <div className="p-3 border-t border-gray-800/50">
             <Link
               to="/login"
               className="w-full px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors flex items-center gap-2 justify-center"
             >
               <BiLogIn className="w-4 h-4" />
               Sign In
             </Link>
           </div>
         )}
       </aside>
 */
