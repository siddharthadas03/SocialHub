import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(
      "🔐 Auth middleware - Authorization header:",
      authHeader ? "✅ Present" : "❌ Missing",
    );

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("❌ Token missing or invalid format");
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified for user:", decoded.id);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("❌ User not found in database");
      return res.status(401).json({ message: "Not authorized, user missing" });
    }

    console.log("✅ User authenticated:", user.username);
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
