// src/pages/EditUserPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Avatar,
  InputAdornment,
  IconButton,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
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

const SaveButton = styled(Button)(({ theme }) => ({
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

const BackButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.2, 3),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  borderColor: 'rgba(255,255,255,0.5)',
  color: 'white',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: 'translateY(-1px)',
  },
}));

const LogoAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  border: '3px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
}));

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    axios
      .get(`/users/${id}`)
      .then(res => {
        setForm({
          name: res.data.name,
          email: res.data.email,
          password: ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg('Failed to load user data');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await axios.put(`/users/${id}`, form);
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Update error', err);
      setErrorMsg(err.response?.data?.message || 'Update failed');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2 
        }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#2d9f47' }} />
          <Typography variant="h6" color="text.secondary">
            Loading user data...
          </Typography>
        </Box>
      </Box>
    );
  }

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
      <Container maxWidth="sm">
        <StyledPaper elevation={0}>
          <HeaderBox>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                mb: 2
              }}>
                <Box sx={{ flex: 1 }} />
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <LogoAvatar>
                    <EditIcon sx={{ fontSize: 40 }} />
                  </LogoAvatar>
                </Box>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <BackButton
                    variant="outlined"
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                  >
                    Back
                  </BackButton>
                </Box>
              </Box>
              <Typography variant="h4" fontWeight="700" gutterBottom textAlign="center">
                Edit User
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }} textAlign="center">
                Update user information for ID: {id}
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
                label="Full Name"
                name="name"
                required
                fullWidth
                value={form.name}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#2d9f47' }} />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter full name"
              />

              <StyledTextField
                label="Email Address"
                name="email"
                type="email"
                required
                fullWidth
                value={form.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#2d9f47' }} />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter email address"
              />

              <StyledTextField
                label="New Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={form.password}
                onChange={handleChange}
                helperText="Leave blank if you don't want to change the password"
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
                placeholder="Enter new password (optional)"
              />

              <SaveButton 
                variant="contained" 
                type="submit" 
                fullWidth
                startIcon={<SaveIcon />}
              >
                Save Changes
              </SaveButton>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                All changes are saved securely
              </Typography>
            </Box>
          </Box>
        </StyledPaper>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 Marabes. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}