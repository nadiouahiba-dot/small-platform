// src/pages/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  AdminPanelSettings as AdminIcon,
  Work as WorkIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import MarabesLogo from '../assets/marabes-logo.png'; // ✅ add your logo

// ===== Styles =====
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
  '& input:-webkit-autofill': {
    boxShadow: '0 0 0 100px white inset !important', // ✅ removes blue autofill background
    WebkitTextFillColor: '#000 !important',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#2d9f47',
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
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
  '& input:-webkit-autofill': {
    boxShadow: '0 0 0 100px white inset !important', 
    WebkitTextFillColor: '#000 !important',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#2d9f47',
  },
}));

const RegisterButton = styled(Button)(({ theme }) => ({
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

// ===== Component =====
const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        name,
        email,
        password,
        role,
      });
      if (response.data.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setError('Error during registration. Please try again.');
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      <Box
        component="img"
        src={MarabesLogo}
        alt="Marabes background"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
          width: '1000px',
          opacity: 0.08,
          filter: 'blur(15px) grayscale(100%)',
          zIndex: 0,
          animation: 'zoomFade 18s ease-in-out infinite',
          '@keyframes zoomFade': {
            '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.08 },
            '50%': { transform: 'translate(-50%, -50%) scale(1.1)', opacity: 0.1 },
            '100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.08 },
          },
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <StyledPaper elevation={0}>
          <HeaderBox>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box sx={{ flex: 1 }} />
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <LogoAvatar>
                    <PersonAddIcon sx={{ fontSize: 40 }} />
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
                Create Account
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }} textAlign="center">
                Register a new user to get started
              </Typography>
            </Box>
          </HeaderBox>

          <Box sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                Registration successful! User has been created.
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
                type="text"
                required
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#2d9f47' }} />
                    </InputAdornment>
                  ),
                }}
              />

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
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#2d9f47' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <StyledFormControl fullWidth required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  label="Role"
                  startAdornment={
                    <InputAdornment position="start">
                      {role === 'admin' ? (
                        <AdminIcon sx={{ color: '#2d9f47', ml: 1 }} />
                      ) : (
                        <WorkIcon sx={{ color: '#2d9f47', ml: 1 }} />
                      )}
                    </InputAdornment>
                  }
                >
                  <MenuItem value="employee">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkIcon sx={{ fontSize: 20 }} /> Employee
                    </Box>
                  </MenuItem>
                  <MenuItem value="admin">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AdminIcon sx={{ fontSize: 20 }} /> Admin
                    </Box>
                  </MenuItem>
                </Select>
              </StyledFormControl>

              <RegisterButton variant="contained" type="submit" fullWidth>
                Create Account
              </RegisterButton>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Secure registration powered by Marabes
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
};

export default RegisterPage;
