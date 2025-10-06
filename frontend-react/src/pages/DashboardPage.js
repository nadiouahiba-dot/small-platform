// src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Avatar,
  Chip,
  Grid,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ExitToApp as LogoutIcon,
  Assessment as ReportsIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a3a52 0%, #2d5a3f 100%)',
  padding: theme.spacing(4),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '300px',
    height: '300px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    transform: 'translate(30%, -30%)',
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
  color: 'white',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(45, 159, 71, 0.3)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(45, 159, 71, 0.4)',
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid #e0e0e0',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.12)',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#f8f9fa',
    borderColor: '#2d9f47',
    transform: 'translateX(4px)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
  },
}));

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found. Please login.');
      return;
    }

    axios
      .get('http://localhost:5000/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard. Please login again.');
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2, 
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)'
          }}
        >
          {error}
        </Alert>
        <ActionButton 
          variant="contained" 
          onClick={() => navigate('/login')}
          fullWidth
        >
          Go to Login
        </ActionButton>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2 
        }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#2d9f47' }} />
          <Typography variant="h6" color="text.secondary">
            Loading your dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: 4 }}>
      <Container maxWidth="lg">
        {data.role === 'admin' ? (
          <>
            <StyledPaper elevation={0}>
              <HeaderBox>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                      <AdminIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight="700">
                        Admin Dashboard
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                        Welcome back! Here's your overview
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </HeaderBox>

              <Box sx={{ p: 4 }}>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <StatsCard>
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
                          <PeopleIcon sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h3" fontWeight="700">
                            {data.totalEmployees}
                          </Typography>
                          <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            Total Employees
                          </Typography>
                        </Box>
                      </CardContent>
                    </StatsCard>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TimeIcon sx={{ color: '#2d9f47' }} />
                    <Typography variant="h6" fontWeight="600" color="text.primary">
                      Recent Login Activity
                    </Typography>
                  </Box>
                  <List sx={{ bgcolor: 'transparent' }}>
                    {data.recentLogins.map((user, index) => (
                      <StyledListItem key={index}>
                        <Avatar sx={{ bgcolor: '#2d9f47', mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight="600">
                              {user.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              Last Login: {user.last_login || 'Never logged in'}
                            </Typography>
                          }
                        />
                      </StyledListItem>
                    ))}
                  </List>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <ActionButton
                    variant="contained"
                    onClick={() => navigate('/reports')}
                    startIcon={<ReportsIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                    }}
                  >
                    View Reports
                  </ActionButton>

                  <ActionButton
                    variant="outlined"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{
                      borderColor: '#d32f2f',
                      color: '#d32f2f',
                      '&:hover': {
                        borderColor: '#d32f2f',
                        bgcolor: 'rgba(211, 47, 47, 0.04)',
                      },
                    }}
                  >
                    Logout
                  </ActionButton>
                </Box>
              </Box>
            </StyledPaper>
          </>
        ) : data.role === 'employee' ? (
          <>
            <StyledPaper elevation={0}>
              <HeaderBox>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                      <DashboardIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight="700">
                        Employee Dashboard
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                        Your personal workspace
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </HeaderBox>

              <Box sx={{ p: 4 }}>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <InfoCard>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: '#2d9f47' }}>
                            <PersonIcon />
                          </Avatar>
                          <Typography variant="h6" fontWeight="600">
                            Profile Information
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                              Full Name
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {data.user.name}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                              Email Address
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                              <Typography variant="body1" fontWeight="500">
                                {data.user.email}
                              </Typography>
                            </Box>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                              Role
                            </Typography>
                            <Chip 
                              label={data.user.role} 
                              color="primary"
                              sx={{ 
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                bgcolor: '#2d9f47'
                              }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </InfoCard>
                  </Grid>
                </Grid>

                <ActionButton
                  variant="outlined"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{
                    borderColor: '#d32f2f',
                    color: '#d32f2f',
                    '&:hover': {
                      borderColor: '#d32f2f',
                      bgcolor: 'rgba(211, 47, 47, 0.04)',
                    },
                  }}
                >
                  Logout
                </ActionButton>
              </Box>
            </StyledPaper>
          </>
        ) : (
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            Unknown role detected
          </Alert>
        )}
      </Container>
    </Box>
  );
}