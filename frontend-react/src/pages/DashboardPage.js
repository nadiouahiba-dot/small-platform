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

  // 🔽 NEW for the users table & modal
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Snackbar,
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

  // 🔽 NEW icons used in the users table
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
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

// 🔽 Glassy Paper for table container
const GlassPaper = styled(Paper)(() => ({
  background: 'rgba(255,255,255,0.86)',
  backdropFilter: 'blur(18px)',
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
  borderRadius: 16,
}));

// 🔽 subtle icon button styling for table actions
const ActionIconButton = styled(IconButton)(({ theme }) => ({
  background: 'rgba(0,0,0,0.04)',
  marginRight: theme.spacing(1),
  '&:hover': {
    background: 'rgba(0,0,0,0.08)',
  },
}));

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  // ===== NEW: Users state for the new table =====
  const [users, setUsers] = useState([]);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'employee' });

  // feedback
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // ========= ORIGINAL FETCH =========
  useEffect(() => {
    if (!token) {
      setError('No token found. Please login.');
      return;
    }

    axios
      .get(`${BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
  setData(res.data);
  setUsers(res.data.allUsers || []);   // ✅ get users from backend response
})
      .catch(() => setError('Failed to load dashboard. Please login again.'));
  }, [token]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // ===== Users table handlers (Add / Edit / Delete) =====
  const openAddModal = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', role: 'employee' });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({ name: user.name || '', email: user.email || '', role: user.role || 'employee' });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSaveUser = async () => {
  try {
    if (editingUser) {
      await axios.put(`${BASE_URL}/users/${editingUser.id || editingUser._id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({ open: true, message: 'User updated.', severity: 'success' });
    } else {
      await axios.post(`${BASE_URL}/users`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({ open: true, message: 'User created.', severity: 'success' });
    }
    closeModal();

    // ✅ refresh user table from /dashboard
    axios
      .get(`${BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.allUsers || []))
      .catch(() => setToast({ open: true, message: 'Failed to refresh users.', severity: 'error' }));

  } catch (e) {
    setToast({ open: true, message: 'Action failed. Check input.', severity: 'error' });
  }
};


  const handleDeleteUser = async (user) => {
  try {
    await axios.delete(`${BASE_URL}/users/${user.id || user._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setToast({ open: true, message: 'User deleted.', severity: 'success' });

    // ✅ refresh user table from /dashboard
    axios
      .get(`${BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.allUsers || []))
      .catch(() => setToast({ open: true, message: 'Failed to refresh users.', severity: 'error' }));

  } catch (e) {
    setToast({ open: true, message: 'Delete failed.', severity: 'error' });
  }
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

              <GlassCard sx={{ p: 3, mb: 3 }}>
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

              {/* ===== NEW: ALL USERS GLASS TABLE ===== */}
              <GlassCard sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h5" fontWeight={700}>
                    All Users
                  </Typography>
                  <Tooltip title="Add New Member">
                    <IconButton
                      onClick={openAddModal}
                      sx={{
                        background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                        color: 'white',
                        '&:hover': { opacity: 0.9 },
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <TableContainer component={GlassPaper}>
                  <Table size="small" aria-label="users table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Last Login</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.length === 0 ? (
                       <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                          No users found.
                        </TableCell>
                       </TableRow>
                     ) : (
                      users.map((u) => (

                          <TableRow key={u.id || u._id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ width: 34, height: 34, bgcolor: '#2d9f47' }}>
                                  <PersonIcon fontSize="small" />
                                </Avatar>
                                <Typography fontWeight={600}>{u.name}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell sx={{ textTransform: 'capitalize' }}>{u.role || 'employee'}</TableCell>
                            <TableCell>
                              {u.last_login
                                ? new Date(u.last_login).toLocaleString('en-GB', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                  })
                                : '—'}
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Edit">
                                <ActionIconButton onClick={() => openEditModal(u)} size="small">
                                  <EditIcon fontSize="small" />
                                </ActionIconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <ActionIconButton onClick={() => handleDeleteUser(u)} size="small">
                                  <DeleteIcon fontSize="small" />
                                </ActionIconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </GlassCard>
              {/* ===== END: NEW USERS TABLE ===== */}
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

      {/* ===== Modal for Add/Edit User ===== */}
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingUser ? 'Edit User' : 'Add New Member'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              type="email"
              fullWidth
            />
            <TextField
              label="Role"
              name="role"
              value={form.role}
              onChange={handleFormChange}
              select
              SelectProps={{ native: true }}
              fullWidth
            >
              <option value="admin">admin</option>
              <option value="employee">employee</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeModal} variant="outlined">Cancel</Button>
          <Button
            onClick={handleSaveUser}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2800}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        message={toast.message}
      />
    </Box>
  );
}
