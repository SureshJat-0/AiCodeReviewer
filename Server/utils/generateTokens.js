import jwt from "jsonwebtoken";

function getAccessToken(userId) {
  const token = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET_KEY,
    { expiresIn: 15 * 60 * 1000 }, // 15 mins
  );
  return token;
}
function getRefreshToken(userId) {
  const token = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: 7 * 24 * 60 * 60 * 1000 }, // 7 days
  );
  return token;
}

export { getAccessToken, getRefreshToken };
