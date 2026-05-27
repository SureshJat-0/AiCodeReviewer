import axios from "axios";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

import { getAccessToken, getRefreshToken } from "../utils/generateTokens.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const redirectOAuth = (req, res) => {
  const redirectUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_OAUTH_REDIRECT_URI}&response_type=code&scope=openid email profile`;
  res.redirect(redirectUrl);
};

const OAuthCallback = async (req, res) => {
  const { code } = req.query;

  const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    grant_type: "authorization_code",
  });

  const { access_token, id_token } = tokenRes.data;

  const userInfo = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    { headers: { Authorization: `Bearer ${access_token}` } },
  );

  let user = await User.findOne({ email: userInfo.data.email });
  if (!user) {
    user = await User.create({
      email: userInfo.data.email,
      fullName: userInfo.data.name,
      oauthProvider: "google",
      oauthId: userInfo.data.id,
      reviews: [],
    });
  }

  const tempToken = jwt.sign(
    { userId: user._id },
    `${process.env.JWT_ACCESS_SECRET_KEY}_TEMP`,
    { expiresIn: 5 * 60 * 1000 }, // 5 min
  );

  res.redirect(
    `${process.env.CLIENT_URL}/auth/oauth/success?token=${tempToken}`,
  );
};

const gitHubRedirectOAuth = (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_OAUTH_REDIRECT_URI}`;
  res.redirect(redirectUrl);
};

const gitHubOAuthCallback = async (req, res) => {
  const { code } = req.query;

  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      code,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      redirect_uri: process.env.GITHUB_OAUTH_REDIRECT_URI,
    },
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  const { access_token } = tokenRes.data;

  const userInfo = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  let user = await User.findOne({ email: userInfo.data.email });
  if (!user) {
    user = await User.create({
      email: userInfo.data.email,
      fullName: userInfo.data.login,
      oauthProvider: "github",
      oauthId: userInfo.data.id,
      reviews: [],
    });
  }

  const tempToken = jwt.sign(
    { userId: user._id },
    `${process.env.JWT_ACCESS_SECRET_KEY}_TEMP`,
    { expiresIn: 5 * 60 * 1000 }, // 5 min
  );

  res.redirect(
    `${process.env.CLIENT_URL}/auth/oauth/success?token=${tempToken}`,
  );
};

const exchangeToken = (req, res) => {
  const { token } = req.body;
  const decoded = jwt.verify(
    token,
    `${process.env.JWT_ACCESS_SECRET_KEY}_TEMP`,
  );

  const accessToken = getAccessToken(decoded.userId);
  const refreshToken = getRefreshToken(decoded.userId);

  res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({ success: true });
};

export {
  redirectOAuth,
  OAuthCallback,
  gitHubRedirectOAuth,
  gitHubOAuthCallback,
  exchangeToken,
};
