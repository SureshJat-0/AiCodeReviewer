import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { HiLightningBolt, HiCheckCircle } from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import { FiChevronLeft, FiEye, FiEyeOff, FiPlus } from "react-icons/fi";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { useAuth } from "../contexts/auth";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserSignup = async (e) => {
    e.preventDefault();
    await signup(formData);
    setFormData({
      fullName: "",
      email: "",
      password: "",
    });
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
            Analyze your code with AI-powered insights on bugs, security risks,
            and best practices.
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

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="mb-8 flex">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-1">Create Account</h2>
                <p className="text-gray-400 wrap-break-word">
                  Create an account to start AI-powered reviews
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="inline-block mb-6 whitespace-nowrap shrink-0"
            >
              <button className="px-4 py-2 mt-4 rounded-lg bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-gray-200 font-medium text-sm transition-all flex items-center gap-2">
                <FiChevronLeft className="w-4 h-4" />
                Back to Home
              </button>
            </Link>
          </div>

          <form onSubmit={handleUserSignup} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-[#1e1e1e] transition-all"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  autoComplete="password"
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

            {/* Confirm Password Input */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-[#1e1e1e] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div> */}

            {/* Terms & Conditions */}
            {/* <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 bg-[#1a1a1a] border border-gray-800 rounded cursor-pointer mt-1"
              />
              <span className="text-gray-400 text-sm">
                I agree to the{" "}
                <a href="#" className="text-blue-500 hover:text-blue-400">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-500 hover:text-blue-400">
                  Privacy Policy
                </a>
              </span>
            </label> */}

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all flex items-center justify-center gap-2 mt-6"
            >
              <FiPlus className="w-5 h-5" />
              Create Account
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

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-gray-200 font-medium text-sm transition-all flex items-center justify-center gap-2"
            >
              <FaGoogle className="w-4 h-4" />
              Google
            </button>
            <button
              type="button"
              className="px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-gray-200 font-medium text-sm transition-all flex items-center justify-center gap-2"
            >
              <FaGithub className="w-4 h-4" />
              GitHub
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="flex my-2">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  fullName: "Demo User",
                  email: "demo@example.com",
                  password: "demo123",
                });
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
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
