import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = req?.cookies?.token;
  if (!token) return res.status(200).json({ user: null });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ user: null });
  }
}
