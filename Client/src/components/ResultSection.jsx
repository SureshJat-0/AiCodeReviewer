import {
  HiLightBulb,
  HiDocumentText,
  HiExclamation,
  HiLockClosed,
  HiShieldCheck,
  HiBadgeCheck,
  HiCheckCircle,
} from "react-icons/hi";
import { toast } from "react-hot-toast";
import { FiCheck, FiCode, FiCopy } from "react-icons/fi";
import Editor from "@monaco-editor/react";

export default function ResultSection({ response, loading, originalCode }) {
  const copyImprovedCodeToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response.improvedCode);
      toast.success("Improved code copied to your clipboard.");
      console.log("Improved code copied!");
    } catch (err) {
      toast.error("Unable to copy right now. Please try again.");
      console.error("Failed to copy text: ", err);
    }
  };
  const SeverityBadge = ({ severity }) => {
    const colors = {
      low: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      high: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[severity?.toLowerCase()] || colors.medium}`}
      >
        {severity}
      </span>
    );
  };

  // bugs, security, best practice sections
  const SectionMapChildComponent = ({ section }) => {
    return (
      <div className="p-4 rounded-xl bg-[#0f0f0f] border border-gray-800 hover:border-gray-700 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-base text-gray-200">
            {section.issue}
          </h3>
          <SeverityBadge severity={section.severity} />
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          {section.explanation}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {!response ? (
        loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <HiLightBulb className="w-16 h-16 text-blue-500 mb-4" />
              <p className="text-lg text-gray-300">Review in progress...</p>
              <p className="text-xs text-gray-500 mt-2">
                This may take a few moments
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center mb-6">
              <FiCode className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready when you are</h3>
            <p className="text-sm text-gray-400 text-center max-w-md">
              Paste your code and run a review to get quick feedback on bugs,
              security, and best practices
            </p>
          </div>
        )
      ) : (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                <HiDocumentText className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-3">Review Summary</h2>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {response?.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Bugs Section */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <HiExclamation className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-xl font-bold">Bugs</h2>
              <span className="ml-auto px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
                {response?.bugs?.length || 0} found
              </span>
            </div>
            {response?.bugs && response?.bugs.length !== 0 ? (
              <div className="space-y-4">
                {response.bugs.map((bug, index) => (
                  <SectionMapChildComponent section={bug} key={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <FiCheck className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-sm text-gray-400">
                  No bugs detected. Nice work.
                </p>
              </div>
            )}
          </div>

          {/* Security Section */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <HiLockClosed className="w-5 h-5 text-yellow-400" />
              </div>
              <h2 className="text-xl font-bold">Security Issues</h2>
              <span className="ml-auto px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium">
                {response?.security?.length || 0} found
              </span>
            </div>
            {response?.security && response?.security.length !== 0 ? (
              <div className="space-y-4">
                {response.security.map((securityChild, index) => (
                  <SectionMapChildComponent
                    section={securityChild}
                    key={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <HiShieldCheck className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-sm text-gray-400">
                  No security issues detected.
                </p>
              </div>
            )}
          </div>

          {/* Best Practices Section */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <HiBadgeCheck className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold">Best Practices</h2>
              <span className="ml-auto px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium">
                {response?.bestPractices?.length || 0} suggestions
              </span>
            </div>
            {response?.bestPractices && response?.bestPractices.length !== 0 ? (
              <div className="space-y-4">
                {response.bestPractices.map((bestPractice, index) => (
                  <SectionMapChildComponent
                    section={bestPractice}
                    key={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <FiCheck className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-sm text-gray-400">
                  Already following best practices.
                </p>
              </div>
            )}
          </div>

          {/* Improved Code Section */}
          <div
            className={`grid grid-cols-1 ${originalCode ? "lg:grid-cols-2" : ""} gap-6`}
          >
            {/* Original Code */}
            {originalCode && (
              <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                    <FiCode className="w-5 h-5 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-bold">Original Code</h2>
                </div>
                <div className="p-2">
                  <Editor
                    height="60vh"
                    defaultLanguage="javascript"
                    value={originalCode}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      roundedSelection: true,
                      scrollBeyondLastLine: true,
                      automaticLayout: true,
                      padding: { top: 16, bottom: 16 },
                    }}
                  />
                </div>
              </div>
            )}

            {/* Improved Code */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <HiCheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold">Improved Code</h2>
                </div>
                <button
                  onClick={copyImprovedCodeToClipboard}
                  className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors flex items-center gap-2"
                >
                  <FiCopy className="w-4 h-4" />
                  Copy
                </button>
              </div>
              <div className="p-2">
                <Editor
                  height="50vh"
                  defaultLanguage="javascript"
                  value={response?.improvedCode}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: true,
                    scrollBeyondLastLine: true,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
