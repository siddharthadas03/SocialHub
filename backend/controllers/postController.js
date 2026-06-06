import Post from "../models/Post.js";

const uploadUrl = (file) => (file ? `/uploads/${file.filename}` : "");

export const createPost = async (req, res, next) => {
  try {
    const text = req.body.text?.trim() || "";
    const image = uploadUrl(req.file);

    if (!text && !image) {
      return res
        .status(400)
        .json({ message: "Add text, an image, or both before posting" });
    }

    const post = await Post.create({
      userId: req.user._id,
      username: req.user.username,
      userAvatar: req.user.profileImage,
      text,
      image,
    });

    res.status(201).json(post);
  } catch (error) {
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
