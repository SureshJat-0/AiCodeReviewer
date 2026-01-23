import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { HiLightningBolt, HiCheckCircle } from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import { FiChevronLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { BiLogIn } from "react-icons/bi";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("UI preview only — authentication isn't connected.");
  };

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-gray-100">
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

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] border-r border-gray-800/50 flex-col justify-between p-12">
        <div>
          <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Code Review
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-md">
            Analyze your code with AI-powered insights on bugs, security
            risks, and best practices.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0 mt-1">
              <HiLightningBolt className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Instant Analysis</h3>
              <p className="text-sm text-gray-400">
                  Get detailed insights on your code quality
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0 mt-1">
              <HiCheckCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Multiple Checks</h3>
              <p className="text-sm text-gray-400">
                  Checks for bugs, security gaps, and best practices
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0 mt-1">
              <MdHistory className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Keep History</h3>
              <p className="text-sm text-gray-400">
                  Keep a record of every review
              </p>
            </div>
          </div>
          <Link to="/" className="inline-block mb-6">
            <button className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-gray-200 font-medium text-sm transition-all flex items-center gap-2">
              <FiChevronLeft className="w-4 h-4" />
              Back to Home
            </button>
          </Link>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-1">Welcome Back</h2>
                <p className="text-gray-400">
                  Sign in to continue your AI reviews
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-[#1e1e1e] transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-[#1e1e1e] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-[#1a1a1a] border border-gray-800 rounded cursor-pointer"
                />
                <span className="text-gray-400">Remember me</span>
              </label>
              <a
                href="#"
                className="text-blue-500 hover:text-blue-400 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all flex items-center justify-center gap-2 mt-6"
            >
              <BiLogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0f0f0f] text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-gray-200 font-medium text-sm transition-all flex items-center justify-center gap-2">
              <FaGoogle className="w-4 h-4" />
              Google
            </button>
            <button className="px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-gray-200 font-medium text-sm transition-all flex items-center justify-center gap-2">
              <FaGithub className="w-4 h-4" />
              GitHub
            </button>
          </div>

          {/* Demo credentials and Sign Up Link */}
          <div className="flex my-2">
            <button
              type="button"
              onClick={() => {
                setEmail("demo@example.com");
                setPassword("Demo@12345");
                toast.success("Demo credentials added.");
              }}
              className="px-3 py-2 grow rounded-md bg-blue-600/10 border border-blue-600/30 text-blue-300 hover:bg-blue-600/20 hover:border-blue-600/40 hover:text-blue-200 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              title="Fill with demo credentials"
            >
              <HiSparkles className="w-4 h-4" />
              Use Demo
            </button>
          </div>
          <p className="mt-6 text-center text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
