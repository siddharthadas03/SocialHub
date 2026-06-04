import { Box, Container, Paper, Typography } from '@mui/material';

const AuthLayout = ({ title, subtitle, children }) => (
  <Box className="auth-shell">
    <Container maxWidth="sm">
      <Box className="auth-brand">
        <Box className="brand__mark brand__mark--large">S</Box>
        <Typography variant="h4" component="h1" fontWeight={800}>
          SocialHub
        </Typography>
      </Box>
      <Paper className="auth-panel">
        <Typography variant="h5" component="h2" fontWeight={800} gutterBottom>
          {title}
        </Typography>
        <Typography color="text.secondary" mb={3}>
          {subtitle}
        </Typography>
        {children}
      </Paper>
    </Container>
  </Box>
);

export default AuthLayout;
