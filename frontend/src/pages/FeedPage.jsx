import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Container, Stack, Typography } from '@mui/material';
import api from '../api/axios.js';
import AppNavbar from '../components/AppNavbar.jsx';
import CreatePost from '../components/CreatePost.jsx';
import PostCard from '../components/PostCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const replacePost = (posts, updatedPost) => posts.map((post) => (post._id === updatedPost._id ? updatedPost : post));

const FeedPage = () => {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = async () => {
    try {
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const createPost = async ({ text, image }) => {

    const formData = new FormData();
    formData.append('text', text);
    if (image) {
      formData.append('image', image);
    }

    const { data } = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setPosts((current) => [data, ...current]);
  };

  const likePost = async (postId) => {
    const { data } = await api.patch(`/posts/${postId}/like`);
    setPosts((current) => replacePost(current, data));
  };

  const commentOnPost = async (postId, text) => {
    const { data } = await api.post(`/posts/${postId}/comments`, { text });
    setPosts((current) => replacePost(current, data));
  };

  return (
    <Box className="app-shell">
      <AppNavbar />
      <Container maxWidth="md" className="feed-container">
        <Stack spacing={2.5}>
          <Box className="feed-heading">
            <Typography variant="h4" component="h1" fontWeight={900}>
              Home Feed
            </Typography>
            <Typography color="text.secondary">Newest updates from everyone on SocialHub.</Typography>
          </Box>

          <CreatePost onCreate={createPost} />

          {error && <Alert severity="error">{error}</Alert>}

          {loading ? (
            <Stack alignItems="center" py={6}>
              <CircularProgress />
            </Stack>
          ) : posts.length === 0 ? (
            <Box className="empty-state">
              <Typography variant="h6" fontWeight={800}>
                No posts yet
              </Typography>
              <Typography color="text.secondary">Create the first update and it will appear here.</Typography>
            </Box>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} onLike={likePost} onComment={commentOnPost} />)
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default FeedPage;
