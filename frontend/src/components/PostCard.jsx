import { useState } from 'react';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { Avatar, Box, Button, Card, CardContent, Divider, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { assetUrl } from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const formatDate = (dateString) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(dateString));

const PostCard = ({ post, onLike, onComment }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const initials = post.username?.slice(0, 1).toUpperCase() || 'S';
  const currentUserLiked = post.likes.some((like) => like.userId === user?._id);

  const submitComment = async (event) => {
    event.preventDefault();
    const trimmedComment = commentText.trim();

    if (!trimmedComment) return;

    setSubmittingComment(true);
    try {
      await onComment(post._id, trimmedComment);
      setCommentText('');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <Card component="article" className="post-card">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar src={assetUrl(post.userAvatar)}>{initials}</Avatar>
            <Box minWidth={0}>
              <Typography variant="subtitle1" fontWeight={800} noWrap>
                {post.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(post.createdAt)}
              </Typography>
            </Box>
          </Stack>

          {post.text && (
            <Typography variant="body1" className="post-card__text">
              {post.text}
            </Typography>
          )}

          {post.image && (
            <Box className="post-card__image">
              <img src={assetUrl(post.image)} alt={`${post.username}'s post`} />
            </Box>
          )}

          <Stack direction="row" justifyContent="space-between" color="text.secondary">
            <Typography variant="body2">{post.likes.length} Likes</Typography>
            <Typography variant="body2">{post.comments.length} Comments</Typography>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              color={currentUserLiked ? 'secondary' : 'inherit'}
              startIcon={currentUserLiked ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
              onClick={() => onLike(post._id)}
            >
              Like
            </Button>
            <Button fullWidth color="inherit" startIcon={<ChatBubbleOutlineRoundedIcon />}>
              Comment
            </Button>
          </Stack>

          <Stack component="form" direction="row" spacing={1} onSubmit={submitComment}>
            <Avatar sx={{ width: 32, height: 32 }}>{user?.username?.slice(0, 1).toUpperCase()}</Avatar>
            <TextField
              size="small"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Write a comment"
              fullWidth
            />
            <Tooltip title="Send comment">
              <span>
                <IconButton type="submit" color="primary" disabled={submittingComment || !commentText.trim()}>
                  <SendRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>

          {post.comments.length > 0 && (
            <Stack spacing={1.25} className="comments-list">
              {post.comments.map((comment) => (
                <Box key={comment._id} className="comment">
                  <Typography variant="body2" fontWeight={800}>
                    {comment.username}
                  </Typography>
                  <Typography variant="body2">{comment.text}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(comment.createdAt)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PostCard;
