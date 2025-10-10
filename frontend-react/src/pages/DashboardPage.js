// src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
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
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  InputBase,
  Badge,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  ExitToApp as LogoutIcon,
  Assessment as ReportsIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import MarabesLogo from '../assets/marabes-logo.png'; // ✅ Added logo import

const BASE_URL = 'http://localhost:5000/api';
const drawerWidth = 260;

// ====== STYLES ======
const StatsCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
  color: 'white',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(45, 159, 71, 0.25)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
    opacity: 0,
    transition: 'opacity 0.4s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 48px rgba(45, 159, 71, 0.35)',
    '&::before': {
      opacity: 1,
    },
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  backgroundColor: '#ffffff',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  '&:hover': {
    backgroundColor: '#f0f9f4',
    borderColor: '#2d9f47',
    transform: 'translateX(8px)',
    boxShadow: '0 4px 16px rgba(45, 159, 71, 0.15)',
  },
}));

const SidebarButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  color: 'rgba(255, 255, 255, 0.9)',
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 2),
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '3px',
    background: '#2d9f47',
    transform: 'scaleY(0)',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    backgroundColor: 'rgba(45, 159, 71, 0.15)',
    color: '#ffffff',
    paddingLeft: theme.spacing(2.5),
    '&::before': {
      transform: 'scaleY(1)',
    },
  },
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
}));

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('No token found. Please login.');
      return;
    }

    axios
      .get(`${BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load dashboard. Please login again.'));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // ====== UI ======
  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          sx={{
            background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
            textTransform: 'none',
            px: 3,
            py: 1.5,
            borderRadius: 2,
          }}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: 'white' }} />
        <Typography variant="h6" sx={{ mt: 3, color: 'white', fontWeight: 500 }}>
          Loading your dashboard...
        </Typography>
      </Box>
    );
  }

  const hasLogins =
    Array.isArray(data.recentLogins) && data.recentLogins.length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#f5f7fb',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ✅ Animated background logo */}
      <Box
        component="img"
        src={MarabesLogo}
        alt="Marabes background"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
          width: '1200px',
          opacity: 0.08,
          filter:
            'blur(14px) grayscale(100%) drop-shadow(0px 0px 25px rgba(0,0,0,0.15))',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'zoomFade 20s ease-in-out infinite',
          '@keyframes zoomFade': {
            '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.08 },
            '50%': {
              transform: 'translate(-50%, -50%) scale(1.08)',
              opacity: 0.1,
            },
            '100%': {
              transform: 'translate(-50%, -50%) scale(1)',
              opacity: 0.08,
            },
          },
        }}
      />

      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            color: 'white',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)', // glass effect
          },
        }}
      >
        <Box>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {/* ✅ Replaced dashboard icon with logo */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '24px',
                overflow: 'hidden',
                margin: '0 auto 16px',
                boxShadow: '0 8px 24px rgba(45, 159, 71, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 70%)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              <Box
                component="img"
                src={MarabesLogo}
                alt="Marabes Logo"
                sx={{
                  width: '70%',
                  height: '70%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
            </Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}
            >
              Dashboard
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Management System
            </Typography>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

          {role === 'admin' && (
            <>
              <SidebarButton
                fullWidth
                startIcon={<ReportsIcon />}
                onClick={() => navigate('/reports')}
              >
                View Reports
              </SidebarButton>

              <SidebarButton
                fullWidth
                startIcon={<PeopleIcon />}
                component={Link}
                to="/register"
              >
                Register New
              </SidebarButton>
            </>
          )}
        </Box>

        <Box>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
          <Typography sx={{ textAlign: 'center', opacity: 0.5, fontSize: 12 }}>
            © 2025 Admin Panel
          </Typography>
          <Typography
            sx={{ textAlign: 'center', opacity: 0.4, fontSize: 11, mt: 0.5 }}
          >
            v2.0.1
          </Typography>
        </Box>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', zIndex: 1 }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '-0.5px' }}>
                {role === 'admin' ? 'Admin Dashboard' : 'Employee Dashboard'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  px: 2,
                  py: 0.75,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <SearchIcon sx={{ opacity: 0.8 }} />
                <InputBase
                  placeholder="Search..."
                  sx={{
                    ml: 1,
                    color: 'white',
                    '::placeholder': { opacity: 0.8 },
                  }}
                />
              </Box>

              <IconButton
                color="inherit"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
              >
                <Badge badgeContent={2} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <IconButton
                color="inherit"
                onClick={handleLogout}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* BODY */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
          {/* ===== ADMIN VIEW ===== */}
          {role === 'admin' ? (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <StatsCard>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '20px',
                          background: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <PeopleIcon sx={{ fontSize: 40 }} />
                      </Box>
                      <Box>
                        <Typography variant="h2" fontWeight="700" sx={{ letterSpacing: '-1px' }}>
                          {data.totalEmployees || 0}
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 500 }}>
                          Total Employees
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <TrendingUpIcon sx={{ fontSize: 16 }} />
                          <Typography variant="caption" sx={{ opacity: 0.9 }}>
                            Active workforce
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </StatsCard>
                </Grid>
              </Grid>

              <GlassCard sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <TimeIcon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight="600" color="text.primary">
                        Recent Login Activity
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                        Latest user sessions
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={`${hasLogins ? data.recentLogins.length : 0} Active`}
                    sx={{
                      background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      height: 36,
                    }}
                  />
                </Box>

                {hasLogins ? (
                  <List sx={{ bgcolor: 'transparent' }}>
                    {data.recentLogins.map((user, index) => (
                      <StyledListItem key={index}>
                        <Avatar
                          sx={{
                            background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                            mr: 2,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <PersonIcon />
                        </Avatar>
                        <ListItemText
                          primary={
                            <Typography fontWeight="600" sx={{ fontSize: '1.1rem' }}>
                              {user.name}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                                {user.last_login
                                  ? new Date(user.last_login).toLocaleString('en-GB', {
                                      dateStyle: 'medium',
                                      timeStyle: 'short',
                                    })
                                  : 'Never logged in'}
                              </Typography>
                            </Box>
                          }
                        />
                      </StyledListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <TimeIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                      No recent logins available.
                    </Typography>
                  </Box>
                )}
              </GlassCard>
            </>
          ) : (
            /* ===== EMPLOYEE VIEW ===== */
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
              <GlassCard sx={{ p: 5 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '24px',
                      background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                      boxShadow: '0 12px 32px rgba(45, 159, 71, 0.3)',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 50, color: 'white' }} />
                  </Box>

                  <Typography variant="h4" fontWeight="700" sx={{ mb: 1, letterSpacing: '-0.5px' }}>
                    Welcome Back! 👋
                  </Typography>

                  <Typography variant="h6" color="text.primary" sx={{ mb: 1, fontWeight: 500 }}>
                    {data.name || 'Employee'}
                  </Typography>

                  <Typography color="text.secondary" sx={{ mb: 4, fontSize: '1.05rem' }}>
                    Glad to have you on board today
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(45, 159, 71, 0.05)',
                      border: '1px solid rgba(45, 159, 71, 0.1)',
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <PersonIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.8rem' }}>
                        Name
                      </Typography>
                      <Typography fontWeight="600" sx={{ fontSize: '1.05rem' }}>{data.name}</Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(45, 159, 71, 0.05)',
                      border: '1px solid rgba(45, 159, 71, 0.1)',
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <EmailIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.8rem' }}>
                        Email
                      </Typography>
                      <Typography fontWeight="600" sx={{ fontSize: '1.05rem' }}>{data.email}</Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(45, 159, 71, 0.05)',
                      border: '1px solid rgba(45, 159, 71, 0.1)',
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <WorkIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.8rem' }}>
                        Role
                      </Typography>
                      <Typography fontWeight="600" sx={{ textTransform: 'capitalize', fontSize: '1.05rem' }}>
                        {data.role}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </GlassCard>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
