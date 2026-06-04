import { CircularProgress, Stack } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { authLoading, isAuthenticated } = useAuth();

  if (authLoading) {
    return (
      <Stack minHeight="100vh" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
