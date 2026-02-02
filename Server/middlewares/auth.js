import jwt from "jsonwebtoken";
import CustomExpressError from "../ExpressError.js";

export default function auth(req, res) {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    throw new CustomExpressError(401, "No authorization header, Access denied");
  const token = authHeader.split(" ")[1];
  if (!token)
    throw new CustomExpressError(401, "No token, authorization denied");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    res.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    throw new CustomExpressError(500, err?.message);
  }
}
