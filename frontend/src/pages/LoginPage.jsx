import { useState } from 'react';
import { Alert, Button, Link, Stack, TextField } from '@mui/material';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthLayout title="Welcome back" subtitle="Log in to catch up with the newest posts.">
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Email" name="email" type="email" value={form.email} onChange={updateField} required fullWidth />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={updateField}
          required
          fullWidth
        />
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        
        <Link component={RouterLink} to="/signup" textAlign="center" underline="hover">
          New to SocialHub? Create an account
        </Link>
      </Stack>
    </AuthLayout>
  );
};

export default LoginPage;
