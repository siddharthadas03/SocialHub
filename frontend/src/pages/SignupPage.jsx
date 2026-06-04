import { useState } from 'react';
import { Alert, Button, Link, Stack, TextField } from '@mui/material';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const SignupPage = () => {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
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

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Confirm password must match');
      return;
    }

    setLoading(true);
    try {
      await signup(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Join SocialHub and start sharing updates.">
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Username" name="username" value={form.username} onChange={updateField} required fullWidth />
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
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={updateField}
          required
          fullWidth
        />
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? 'Creating...' : 'Signup'}
        </Button>
        <Link component={RouterLink} to="/login" textAlign="center" underline="hover">
          Already have an account? Login
        </Link>
      </Stack>
    </AuthLayout>
  );
};

export default SignupPage;
