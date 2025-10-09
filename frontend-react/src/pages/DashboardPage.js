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
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const BASE_URL = 'http://localhost:5000/api';
const drawerWidth = 220;

// ====== STYLES ======
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

const SidebarButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  color: 'white',
  marginBottom: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 2),
  background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    background: 'linear-gradient(135deg, #1a7a35 0%, #2d9f47 100%)',
  },
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
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/login')}>
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
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: '#2d9f47' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your dashboard...
        </Typography>
      </Box>
    );
  }

  const hasLogins =
    Array.isArray(data.recentLogins) && data.recentLogins.length > 0;

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f7fa' }}>
      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#1a3a52',
            color: 'white',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ textAlign: 'center', mb: 3, fontWeight: 700 }}
          >
            Dashboard
          </Typography>

          {/* Show buttons only for admin */}
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

        <Box sx={{ textAlign: 'center', opacity: 0.6, fontSize: 13 }}>
          © 2025 Admin Panel
        </Box>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" sx={{ bgcolor: '#2d9f47', px: 2 }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6">
              {role === 'admin' ? 'Admin Dashboard' : 'Employee Dashboard'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                }}
              >
                <SearchIcon />
                <InputBase placeholder="Search..." sx={{ ml: 1, color: 'white' }} />
              </Box>

              <IconButton color="inherit">
                <Badge badgeContent={2} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* BODY */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
          {/* ADMIN VIEW */}
          {role === 'admin' ? (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <StatsCard>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          width: 64,
                          height: 64,
                        }}
                      >
                        <PeopleIcon sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h3" fontWeight="700">
                          {data.totalEmployees || 0}
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

                {hasLogins ? (
                  <List sx={{ bgcolor: 'transparent' }}>
                    {data.recentLogins.map((user, index) => (
                      <StyledListItem key={index}>
                        <Avatar sx={{ bgcolor: '#2d9f47', mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        <ListItemText
                          primary={<Typography fontWeight="600">{user.name}</Typography>}
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              Last Login: {user.last_login || 'Never logged in'}
                            </Typography>
                          }
                        />
                      </StyledListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">
                    No recent logins available.
                  </Typography>
                )}
              </Box>
            </>
          ) : (
            /* EMPLOYEE VIEW */
            <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6 }}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#2d9f47',
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>

                <Typography variant="h5" fontWeight="700" sx={{ mb: 1 }}>
                  Welcome, {data.name || 'Employee'} 👋
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Glad to have you on board!
                </Typography>

                <Box sx={{ textAlign: 'left' }}>
                  <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon sx={{ color: '#2d9f47', mr: 1 }} /> Name:{' '}
                    <strong style={{ marginLeft: 5 }}>{data.name}</strong>
                  </Typography>
                  <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ color: '#2d9f47', mr: 1 }} /> Email:{' '}
                    <strong style={{ marginLeft: 5 }}>{data.email}</strong>
                  </Typography>
                  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    <WorkIcon sx={{ color: '#2d9f47', mr: 1 }} /> Role:{' '}
                    <strong style={{ marginLeft: 5 }}>{data.role}</strong>
                  </Typography>
                </Box>
              </Card>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
