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
import { FiCheck, FiCode, FiCopy, FiDownload, FiX } from "react-icons/fi";
import { MdDataObject, MdPictureAsPdf } from "react-icons/md";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ResultSection({ response, loading, originalCode }) {
  const [openExportWindow, setOpenExportWindow] = useState(false);
  const [outputType, setOutputType] = useState("pdf");

  const copyImprovedCodeToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response.improvedCode);
      toast.success("Code copied to clipboard successfully.", {
        duration: 3000,
        icon: "✓",
      });
    } catch (err) {
      toast.error("Failed to copy code. Please try again.", {
        duration: 3000,
        icon: "✕",
      });
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

  // export output
  const exportOutput = async (e, response) => {
    e.preventDefault();
    if (!response) {
      return toast.error("No review data available for export.", {
        duration: 3000,
      });
    }
    if (typeof response !== "object") {
      return toast.error("Invalid review data format.", {
        duration: 3000,
      });
    }
    if (outputType === "json") {
      const jsonString = JSON.stringify(response, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `code-review-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report exported as JSON successfully.", {
        duration: 3000,
      });
    } else if (outputType === "pdf") {
      try {
        const doc = new jsPDF();
        let cursorY = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginX = 15;
        const usableWidth = pageWidth - marginX * 2;
        doc.setFontSize(16);
        // Heading
        doc.text("Code Review Report", marginX, cursorY);
        cursorY += 10;
        doc.setFontSize(12);
        // Summary
        if (response.summary.length === 0) {
          doc.text("Summary: No findings in summary", marginX, cursorY);
          cursorY += 10;
        } else {
          doc.text("Summary:", marginX, cursorY);
          cursorY += 6;
          const summaryLines = doc.splitTextToSize(
            response.summary,
            usableWidth,
          );
          doc.text(summaryLines, marginX + 5, cursorY);
          cursorY += summaryLines.length * 8 + 10;
        }
        // Bugs
        if (response.bugs.length === 0) {
          doc.text("Bugs: No issues detected", marginX, cursorY);
          cursorY += 10;
        } else {
          doc.text("Bugs:", marginX, cursorY);
          cursorY += 6;
          autoTable(doc, {
            startY: cursorY,
            head: [["Issue", "Severity", "Explanation"]],
            body: response.bugs.map((e) => [
              e.issue,
              e.severity,
              e.explanation,
            ]),
          });
          cursorY = checkPageBreakPdf(doc, cursorY);
          // move cursor below the table
          cursorY = doc.lastAutoTable.finalY + 10;
        }
        // Security Issues
        if (response.security.length === 0) {
          doc.text(
            "Security Issues: No vulnerabilities found",
            marginX,
            cursorY,
          );
          cursorY += 10;
        } else {
          doc.text("Security Issues:", marginX, cursorY);
          cursorY += 6;
          autoTable(doc, {
            startY: cursorY,
            head: [["Issue", "Severity", "Explanation"]],
            body: response.security.map((e) => [
              e.issue,
              e.severity,
              e.explanation,
            ]),
          });
          cursorY = checkPageBreakPdf(doc, cursorY);
          cursorY = doc.lastAutoTable.finalY + 10;
        }
        // Best Practices
        if (response.bestPractices.length === 0) {
          doc.text(
            "Best Practices: Code adheres to best practices",
            marginX,
            cursorY,
          );
          cursorY += 10;
        } else {
          doc.text("Best Practices:", marginX, cursorY);
          cursorY += 6;
          autoTable(doc, {
            startY: cursorY,
            head: [["Issue", "Severity", "Explanation"]],
            body: response.bestPractices.map((e) => [
              e.issue,
              e.severity,
              e.explanation,
            ]),
          });
          cursorY = checkPageBreakPdf(doc, cursorY);
          cursorY = doc.lastAutoTable.finalY + 10;
        }
        cursorY += 10;
        cursorY = checkPageBreakPdf(doc, cursorY);
        // Improved Code
        if (response.improvedCode.length === 0) {
          doc.text(
            "Improved Code: No optimizations recommended",
            marginX,
            cursorY,
          );
          cursorY += 10;
        } else {
          doc.text("Improved Code:", marginX, cursorY);
          cursorY += 6;
          const codeLines = doc.splitTextToSize(
            response.improvedCode,
            usableWidth,
          );
          codeLines.forEach((line) => {
            cursorY = checkPageBreakPdf(doc, cursorY);
            doc.text(line, marginX + 5, cursorY);
            cursorY += 5;
          });
          cursorY += 10;
        }
        doc.save(`code-review-${new Date().toISOString().split("T")[0]}.pdf`);
        toast.success("Report exported as PDF successfully.", {
          duration: 3000,
        });
      } catch (err) {
        toast.error("Failed to generate PDF report. Please try again.", {
          duration: 3000,
        });
      }
    } else {
      return toast.error("Invalid export format selected.", {
        duration: 3000,
      });
    }
  };

  const checkPageBreakPdf = (doc, cursorY, lineHeight = 8) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    const bottomMargin = 20;
    if (cursorY + lineHeight > pageHeight - bottomMargin) {
      doc.addPage();
      return 20;
    }
    return cursorY;
  };

  // Export Modal Component
  const ExportModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-linear-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-md animate-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <FiDownload className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Export Report</h2>
          </div>
          <button
            onClick={() => setOpenExportWindow(false)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800/50"
            aria-label="Close export modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-sm text-gray-400 leading-relaxed">
            Select your preferred format to download the complete code review
            report with all findings and recommendations.
          </p>

          {/* Export Format Options */}
          <div className="space-y-3">
            {/* PDF Option */}
            <label className="flex items-center p-4 rounded-xl border border-gray-700/50 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
              <input
                type="radio"
                name="export"
                value="pdf"
                onChange={(e) => setOutputType(e.target.value)}
                checked={outputType === "pdf"}
                className="w-4 h-4 accent-blue-500"
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center gap-2">
                  <MdPictureAsPdf className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-white group-hover:text-blue-400">
                    PDF Report
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Professional document format for sharing and archiving
                </p>
              </div>
              {outputType === "pdf" && (
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              )}
            </label>
          </div>
          {/* JSON Option */}
          <label className="flex items-center p-4 rounded-xl border border-gray-700/50 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
            <input
              type="radio"
              name="export"
              value="json"
              onChange={(e) => setOutputType(e.target.value)}
              checked={outputType === "json"}
              className="w-4 h-4 accent-blue-500"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-2">
                <MdDataObject className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-white group-hover:text-blue-400">
                  JSON Format
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Structured data format for integration and processing
              </p>
            </div>
            {outputType === "json" && (
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            )}
          </label>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setOpenExportWindow(false)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-700/50 text-gray-300 hover:bg-gray-800/50 hover:border-gray-600/50 transition-all font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={(e) => exportOutput(e, response)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white transition-all font-medium text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/20"
            >
              <FiDownload className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-0">
      {openExportWindow && <ExportModal />}
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
          {/* Export Button Section */}
          <div className="sticky top-0 z-40 pb-4 pt-2 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Code Review Results
                </h1>
                <p className="text-sm text-gray-400">
                  Comprehensive analysis of your code submission
                </p>
              </div>
              <button
                onClick={() => setOpenExportWindow(true)}
                className="px-6 py-3 cursor-pointer bg-linear-to-r from-blue-600 to-blue-500  text-white font-medium rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/30 hover:scale-102"
              >
                <FiDownload className="w-5 h-5" />
                Export Report
              </button>
            </div>
          </div>
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
