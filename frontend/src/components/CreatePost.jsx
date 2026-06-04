import { useRef, useState } from 'react';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { Alert, Avatar, Box, Button, Card, CardContent, IconButton, Stack, TextField, Tooltip } from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';

const CreatePost = ({ onCreate }) => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const initials = user?.username?.slice(0, 1).toUpperCase() || 'S';

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setError('');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file');
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImage(null);
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText && !image) {
      setError('Add text, an image, or both before posting');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onCreate({ text: trimmedText, image });
      setText('');
      clearImage();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card component="section" className="composer">
      <CardContent>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Avatar>{initials}</Avatar>
            <TextField
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={`What's on your mind, ${user?.username || 'there'}?`}
              multiline
              minRows={3}
              fullWidth
            />
          </Stack>

          {preview && (
            <Box className="image-preview">
              <img src={preview} alt="Selected upload preview" />
              <Tooltip title="Remove image">
                <IconButton aria-label="Remove selected image" onClick={clearImage} className="image-preview__close">
                  <CloseRoundedIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            <input ref={fileInputRef} hidden type="file" accept="image/*" onChange={handleImageChange} />
            <Button
              type="button"
              variant="outlined"
              startIcon={<AddPhotoAlternateRoundedIcon />}
              onClick={() => fileInputRef.current?.click()}
            >
              Image
            </Button>
            <Button type="submit" variant="contained" endIcon={<SendRoundedIcon />} disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
