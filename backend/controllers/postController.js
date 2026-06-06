import Post from "../models/Post.js";
import mongoose from "mongoose";

const uploadUrl = (file) => (file ? `/uploads/${file.filename}` : "");

export const createPost = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const text = req.body.text?.trim() || "";
    const image = uploadUrl(req.file);

    if (!text && !image) {
      return res
        .status(400)
        .json({ message: "Add text, an image, or both before posting" });
    }

    console.log("📝 Creating post...");
    console.log("   userId:", req.user._id);
    console.log("   username:", req.user.username);
    console.log("   text length:", text.length);
    console.log("   Connection state:", mongoose.connection.readyState);

    const postData = {
      userId: req.user._id,
      username: req.user.username,
      userAvatar: req.user.profileImage || "",
      text,
      image,
    };

    console.log("   Post data to save:", JSON.stringify(postData, null, 2));

    const post = await Post.create(postData);

    if (!post || !post._id) {
      throw new Error("Post creation failed - no ID returned");
    }

    // Verify the post exists in database
    const verifyPost = await Post.findById(post._id);
    if (!verifyPost) {
      throw new Error("Post saved but could not be retrieved from database");
    }

    console.log("✅ Post saved to MongoDB with ID:", post._id);
    res.status(201).json(post);
  } catch (error) {
    console.error("❌ CRITICAL ERROR creating post:");
    console.error("   Message:", error.message);
    console.error("   Name:", error.name);
    console.error("   Stack:", error.stack);
    console.error("   Full error:", JSON.stringify(error, null, 2));
    next(error);
  }
};

export const getPosts = async (_req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id.toString();
    const existingLikeIndex = post.likes.findIndex(
      (like) => like.userId.toString() === userId,
    );

    if (existingLikeIndex >= 0) {
      post.likes.splice(existingLikeIndex, 1);
    } else {
      post.likes.push({ userId: req.user._id, username: req.user.username });
    }

    await post.save();
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const text = req.body.text?.trim();

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    if (text.length > 500) {
      return res
        .status(400)
        .json({ message: "Comment must be 500 characters or less" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      userId: req.user._id,
      username: req.user.username,
      text,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};
