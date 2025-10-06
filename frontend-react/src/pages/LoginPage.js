// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  Avatar,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Login as LoginIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
  overflow: 'hidden',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a3a52 0%, #2d5a3f 100%)',
  padding: theme.spacing(5, 4),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  textAlign: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-20%',
    width: '200px',
    height: '200px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-30%',
    left: '-10%',
    width: '150px',
    height: '150px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f8faf9',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#2d9f47',
        borderWidth: '2px',
      },
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#2d9f47',
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.8, 4),
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1.1rem',
  background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
  boxShadow: '0 6px 20px rgba(45, 159, 71, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #1a7a35 0%, #2d9f47 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(45, 159, 71, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const LogoAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  border: '3px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
}));

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      // Use relative URL here
      const response = await axios.post('/login', {
        email,
        password,
      });
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      navigate(role === 'admin' ? '/admin-dashboard' : '/employee-dashboard');
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
      console.error('Login error', error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <StyledPaper elevation={0}>
          <HeaderBox>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <LogoAvatar>
                <LoginIcon sx={{ fontSize: 40 }} />
              </LogoAvatar>
              <Typography variant="h4" fontWeight="700" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Sign in to your account
              </Typography>
            </Box>
          </HeaderBox>

          <Box sx={{ p: 4 }}>
            {errorMsg && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.15)'
                }}
              >
                {errorMsg}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            >
              <StyledTextField
                label="Email Address"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#2d9f47' }} />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter your email"
              />

              <StyledTextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#2d9f47' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: '#2d9f47' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter your password"
              />

              <LoginButton variant="contained" type="submit" fullWidth>
                Sign In
              </LoginButton>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Secure login powered by Marabes
              </Typography>
            </Box>
          </Box>
        </StyledPaper>

        {/* Optional: Add decorative elements */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 Marabes. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}