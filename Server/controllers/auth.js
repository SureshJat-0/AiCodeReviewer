import CustomExpressError from "../ExpressError.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { getAccessToken, getRefreshToken } from "../utils/generateTokens.js";

const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName.trim() || !email || !password.trim())
      throw new CustomExpressError(400, "All fields are required");
    const user = await User.findOne({ email });
    if (user)
      throw new CustomExpressError(400, "User with this email already exists");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      fullName,
      email,
      password: hashedPassword,
    };
    const createdUser = await User.create(newUser);
    res.status(200).json({ message: "User created" });
  } catch (err) {
    console.error(err);
    throw new CustomExpressError(
      err.statusCode || 500,
      err.message || "Something went wrong",
    );
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password.trim())
      throw new CustomExpressError(400, "All fields are required");
    const user = await User.findOne({ email });
    if (!user) throw new CustomExpressError(400, "Invalid Credentials");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new CustomExpressError(400, "Invalid Credentials");
    const accessToken = getAccessToken(user._id);
    const refreshToken = getRefreshToken(user._id);
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({
        success: true,
        user: { _id: user._id, fullName: user.fullName, email: user.email },
      });
  } catch (err) {
    console.error(err);
    throw new CustomExpressError(
      err.statusCode || 500,
      err.message || "Something went wrong",
    );
  }
};

async function refreshAccessToken(req, res) {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken)
      throw new CustomExpressError(401, "Refresh token missing");

    const decoded = await jwt.verify(
      incomingRefreshToken,
      process.env.JWT_REFRESH_SECRET_KEY,
    );

    // skip DB step for now

    const newAccessToken = getAccessToken(decoded.userId);
    const newRefreshToekn = getRefreshToken(decoded.userId);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res
      .cookie("accessToken", newRefreshToekn, cookieOptions)
      .cookie("refreshToken", newRefreshToekn, cookieOptions)
      .json({ message: "Token refreshed" });
  } catch (err) {
    console.error(err);
    throw new CustomExpressError(
      err.statusCode || 500,
      err.message || "Something went wrong",
    );
  }
}

const logout = async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };
  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(200)
    .json({ success: true });
};

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json({
      user: { _id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error(err);
    throw new CustomExpressError(
      err.statusCode || 500,
      err.message || "Something went wrong while getting your profile",
    );
  }
};

export { signup, login, logout, profile, refreshAccessToken };
