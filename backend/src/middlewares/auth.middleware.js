const userModel = require("../models/User.model");
const jwt = require("jsonwebtoken");

async function protectRoute(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized-No Token Provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid or Expired Token" });
    }

    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = { protectRoute };
