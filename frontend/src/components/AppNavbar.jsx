import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { AppBar, Avatar, Box, Button, Toolbar, Tooltip, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const initials = user?.username?.slice(0, 1).toUpperCase() || 'S';

  return (
    <AppBar position="fixed" color="inherit" elevation={0} className="topbar">
      <Toolbar className="topbar__inner">
        <Box className="brand">
          <Box className="brand__mark">S</Box>
          <Typography variant="h6" component="span" className="brand__name">
            SocialHub
          </Typography>
        </Box>

        <Box className="topbar__actions">
          <Button startIcon={<HomeRoundedIcon />} color="primary" variant="text" className="hide-xs">
            Home
          </Button>
          <Box className="profile-chip">
            <Avatar sx={{ width: 32, height: 32 }}>{initials}</Avatar>
            <Typography variant="body2" fontWeight={700} className="profile-chip__name">
              {user?.username}
            </Typography>
          </Box>
          <Tooltip title="Logout">
            <Button
              aria-label="Logout"
              onClick={logout}
              color="inherit"
              variant="outlined"
              size="small"
              startIcon={<LogoutRoundedIcon />}
            >
              <span className="hide-xs">Logout</span>
            </Button>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppNavbar;
