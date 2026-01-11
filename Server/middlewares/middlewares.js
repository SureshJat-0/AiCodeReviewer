import { rateLimit } from "express-rate-limit";

// Rate limiter
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  handler: (req, res) => {
    console.warn("Rate limit hit: ", req.ip);
    res.status(429).json({
      error: {
        success: false,
        message: "Too many requests. Please wait and try again.",
      },
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { aiRateLimiter };
