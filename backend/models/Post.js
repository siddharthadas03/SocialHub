import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    userAvatar: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    likes: {
      type: [likeSchema],
      default: []
    },
    comments: {
      type: [commentSchema],
      default: []
    }
  },
  { timestamps: true, versionKey: false }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
