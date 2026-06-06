import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  profileImage: user.profileImage,
  createdAt: user.createdAt,
});

export const signup = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Confirm password must match" });
    }

    console.log("👤 Signup attempt - email:", email);
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log("❌ Email already exists");
      return res.status(409).json({ message: "Email is already registered" });
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("💾 Creating user in MongoDB...");
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    if (!user || !user._id) {
      throw new Error("User creation failed - no ID returned");
    }

    console.log("✅ User created successfully with ID:", user._id);
    res.status(201).json({
      token: createToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("❌ SIGNUP ERROR:", error.message);
    console.error("Stack:", error.stack);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: createToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};
