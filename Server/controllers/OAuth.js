import axios from "axios";
import User from "../models/user.js";
import { getAccessToken, getRefreshToken } from "./auth.js";

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

  const jwt_access_token = getAccessToken(user._id);
  const jwt_refresh_token = getRefreshToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", // client and server are on different domain for production
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  res
    .cookie("accessToken", jwt_access_token, cookieOptions)
    .cookie("refreshToken", jwt_refresh_token, cookieOptions);

  res.redirect(`${process.env.CLIENT_URL}/auth/oauth/success`);
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

  const jwt_access_token = getAccessToken(user._id);
  const jwt_refresh_token = getRefreshToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", // client and server are on different domain for production
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res
    .cookie("accessToken", jwt_access_token, cookieOptions)
    .cookie("refreshToken", jwt_refresh_token, cookieOptions);

  res.redirect(`${process.env.CLIENT_URL}/auth/oauth/success`);
};

export {
  redirectOAuth,
  OAuthCallback,
  gitHubRedirectOAuth,
  gitHubOAuthCallback,
};
