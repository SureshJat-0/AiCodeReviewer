import axios from "axios";

const redirectOAuth = (req, res) => {
  const redirectUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.OAUTH_REDIRECT_URI}&response_type=code&scope=openid email profile`;
  res.redirect(redirectUrl);
};

import User from "../models/user.js";
import { getToken } from "./auth.js";

const OAuthCallback = async (req, res) => {
  const { code } = req.query;

  const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
    code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.OAUTH_REDIRECT_URI,
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
      reviews: [],
    });
  }
  const jwt_token = getToken(user);
  res.cookie("token", jwt_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect(
    `http://localhost:5173/auth/google/success?_id=${user._id.toString()}&email=${user.email}&fullName=${user.fullName}`,
  );
};

export { redirectOAuth, OAuthCallback };
