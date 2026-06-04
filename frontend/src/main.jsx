import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles/global.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb'
    },
    secondary: {
      main: '#f97316'
    },
    background: {
      default: '#f3f6fb',
      paper: '#ffffff'
    },
    text: {
      primary: '#172033',
      secondary: '#647086'
    }
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 700
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(18, 28, 45, 0.08)'
        }
      }
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
