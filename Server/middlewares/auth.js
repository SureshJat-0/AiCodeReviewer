import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const accessToken = req?.cookies?.accessToken;
  if (!accessToken)
    return res.status(401).json({ user: null, message: "Unauthorized" });
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ user: null, message: "Invalid token" });
  }
}
