import express from 'express';
import { addComment, createPost, getPosts, toggleLike } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getPosts);
router.post('/', protect, upload.single('image'), createPost);
router.patch('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);

export default router;
