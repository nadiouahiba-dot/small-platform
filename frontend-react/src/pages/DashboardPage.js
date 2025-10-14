// src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Slide from '@mui/material/Slide';
import SettingsIcon from '@mui/icons-material/Settings';
import { Menu, MenuItem, } from '@mui/material';
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
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  InputBase,
  Badge,
  Chip,
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
  Fade,
  Zoom,
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
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import MarabesLogo from '../assets/marabes-logo.png';

const BASE_URL = 'http://localhost:5000/api';
const drawerWidth = 280;


const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// ====== ENHANCED STYLES ======
const StatsCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
  color: 'white',
  borderRadius: theme.spacing(3),
  boxShadow: '0 12px 40px rgba(45, 159, 71, 0.3)',
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
    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
    opacity: 0,
    transition: 'opacity 0.4s ease',
  },

  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(45, 159, 71, 0.4)',
    '&::before': {
      opacity: 1,
    },
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  backgroundColor: '#ffffff',
  border: '2px solid rgba(45, 159, 71, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '4px',
    background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
    transform: 'scaleY(0)',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    backgroundColor: '#f0f9f4',
    borderColor: '#2d9f47',
    transform: 'translateX(12px)',
    boxShadow: '0 6px 24px rgba(45, 159, 71, 0.2)',
    '&::before': {
      transform: 'scaleY(1)',
    },
  },
}));

const SidebarButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  color: 'rgba(255, 255, 255, 0.85)',
  marginBottom: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.8, 2.5),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '4px',
    background: '#2d9f47',
    transform: 'scaleY(0)',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    backgroundColor: 'rgba(45, 159, 71, 0.2)',
    color: '#ffffff',
    transform: 'translateX(8px)',
    '&::before': {
      transform: 'scaleY(1)',
    },
    '& .MuiSvgIcon-root': {
      transform: 'scale(1.15)',
    },
  },
  '& .MuiSvgIcon-root': {
    transition: 'transform 0.3s ease',
  },
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(30px)',
  borderRadius: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.4)',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)',
  },
}));

const GlassPaper = styled(Paper)(() => ({
  background: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(25px)',
  border: '1px solid rgba(0,0,0,0.05)',
  boxShadow: '0 10px 35px rgba(0,0,0,0.08)',
  borderRadius: 20,
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  background: 'rgba(45, 159, 71, 0.08)',
  marginRight: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(45, 159, 71, 0.15)',
    transform: 'scale(1.1)',
  },
}));

const SearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  bgcolor: 'rgba(255,255,255,0.2)',
  backdropFilter: 'blur(15px)',
  borderRadius: theme.spacing(3),
  px: 2.5,
  py: 1,
  border: '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    bgcolor: 'rgba(255,255,255,0.25)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  '&:focus-within': {
    bgcolor: 'rgba(255,255,255,0.3)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    transform: 'scale(1.02)',
  },
}));

const AnimatedChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
  color: 'white',
  fontWeight: 700,
  fontSize: '0.9rem',
  height: 40,
  px: 2,
  boxShadow: '0 4px 12px rgba(45, 159, 71, 0.3)',
  animation: `${float} 3s ease-in-out infinite`,
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(45, 159, 71, 0.05)',
    transform: 'scale(1.01)',
    boxShadow: '0 4px 12px rgba(45, 159, 71, 0.1)',
  },
}));

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'employee' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [filterText, setFilterText] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [openConfig, setOpenConfig] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
// 🧩 For delete confirmation dialog
const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
const [userToDelete, setUserToDelete] = useState(null);

// ✅ Persistent notifications shared across all pages
const email = localStorage.getItem('email'); // we'll use this as key

const [notifications, setNotifications] = useState(() => {
  // Admin: load global notifications
  if (role === 'admin') {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  }
  // Employee: load personal notifications
  const personal = localStorage.getItem(`notifications_${email}`);
  return personal ? JSON.parse(personal) : [];
});


const [anchorNotif, setAnchorNotif] = useState(null);

// ✅ Listen to updates from other tabs/pages (like ReportsPage)
useEffect(() => {
  const handleStorageChange = () => {
    const saved = localStorage.getItem('notifications');
    if (saved) setNotifications(JSON.parse(saved));
  };
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);

// ✅ Keep notifications in localStorage even after refresh
useEffect(() => {
  if (role === 'admin') {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  } else if (email) {
    localStorage.setItem(`notifications_${email}`, JSON.stringify(notifications));
  }
}, [notifications, role, email]);




const handleNotifOpen = (event) => {
  setAnchorNotif(event.currentTarget);
};

const handleNotifClose = () => {
  setAnchorNotif(null);
};


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
        setUsers(res.data.allUsers || []);
      })
      .catch(() => setError('Failed to load dashboard. Please login again.'));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

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
      if (!form.name || !form.email) {
        setToast({ open: true, message: 'Name and Email are required.', severity: 'error' });
        return;
      }

      if (!editingUser) {
        if (!form.password || !form.confirmPassword) {
          setToast({ open: true, message: 'Password and confirmation are required.', severity: 'error' });
          return;
        }
        if (form.password !== form.confirmPassword) {
          setToast({ open: true, message: 'Passwords do not match.', severity: 'error' });
          return;
        }
      }

      if (editingUser) {
        await axios.put(`${BASE_URL}/users/${editingUser.id || editingUser._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setToast({ open: true, message: 'User updated successfully! ✓', severity: 'success' });
      } else {
        await axios.post(`${BASE_URL}/users`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setToast({ open: true, message: 'User created successfully! ✓', severity: 'success' });
      }
// 🛠 Dynamic notification based on action
setNotifications((prev) => [
  {
    id: Date.now(),
    message: editingUser
      ? `✏️ User "${form.name}" has been modified.`
      : `✅ New user "${form.name}" has been added.`,
    time: new Date().toLocaleTimeString(),
  },
  ...prev,
]);


      closeModal();
      const res = await axios.get(`${BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.allUsers || []);
    } catch (e) {
      console.error(e);
      setToast({ open: true, message: 'Failed to save user.', severity: 'error' });
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await axios.delete(`${BASE_URL}/users/${user.id || user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({ open: true, message: 'User deleted successfully! ✓', severity: 'success' });

      setNotifications((prev) => [
  { id: Date.now(), message: `🗑️ User "${user.name}" was deleted.`, time: new Date().toLocaleTimeString() },
  ...prev,
]);

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

  const handleChangePassword = async () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setToast({ open: true, message: 'Please fill all fields.', severity: 'error' });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ open: true, message: 'Passwords do not match.', severity: 'error' });
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/users/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setToast({ open: true, message: 'Password updated successfully! ✓', severity: 'success' });
      setOpenConfig(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || 'Password update failed.',
        severity: 'error',
      });
    }
  };

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
        <CircularProgress size={70} thickness={4} sx={{ color: 'white' }} />
        <Typography variant="h6" sx={{ mt: 3, color: 'white', fontWeight: 600 }}>
          Loading your dashboard...
        </Typography>
      </Box>
    );
  }

  const hasLogins = Array.isArray(data.recentLogins) && data.recentLogins.length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Enhanced animated background */}
      <Box
        component="img"
        src={MarabesLogo}
        alt="Marabes background"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
          width: '1400px',
          opacity: 0.06,
          filter: 'blur(16px) grayscale(100%) drop-shadow(0px 0px 30px rgba(0,0,0,0.15))',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'zoomFade 25s ease-in-out infinite',
          '@keyframes zoomFade': {
            '0%': { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 0.06 },
            '50%': { transform: 'translate(-50%, -50%) scale(1.12) rotate(2deg)', opacity: 0.08 },
            '100%': { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 0.06 },
          },
        }}
      />

      {/* ENHANCED SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #1a1f2e 0%, #0f1419 100%)',
            color: 'white',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(15px)',
            boxShadow: '4px 0 30px rgba(0,0,0,0.3)',
          },
        }}
      >
        <Box>
          <Zoom in timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
  sx={{
    width: 100,
    height: 100,
    borderRadius: '26px',
    overflow: 'hidden',
    margin: '0 auto 20px',
    boxShadow: '0 12px 35px rgba(45, 159, 71, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    animation: `${float} 4s ease-in-out infinite`,
  }}
>
  <Box
    component="img"
    src={MarabesLogo}
    alt="Marabes Logo"
    sx={{
      width: '100%',
      height: '100%',
      objectFit: 'contain', // ✅ fills the full area without cropping
      borderRadius: '20px',
    }}
  />
</Box>

              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px', mb: 0.5 }}>
                Dashboard
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  fontSize: '0.7rem',
                }}
              >
                Management System
              </Typography>
            </Box>
          </Zoom>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 3 }} />

          <Fade in timeout={1000}>
            <Box>
              {role === 'admin' && (
                <>
                  <SidebarButton fullWidth startIcon={<ReportsIcon />} onClick={() => navigate('/reports')}>
                    View Reports
                  </SidebarButton>

                </>
              )}
            </Box>
          </Fade>
        </Box>

        <Box>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 2 }} />
          <Typography sx={{ textAlign: 'center', opacity: 0.4, fontSize: 11, fontWeight: 500 }}>
            © 2025 Admin Panel
          </Typography>
          <Typography sx={{ textAlign: 'center', opacity: 0.3, fontSize: 10, mt: 0.5 }}>
            v2.1.0 Pro
          </Typography>
        </Box>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', zIndex: 1 }}>
        {/* ENHANCED APP BAR */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(45, 159, 71, 0.3)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1.5 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                {role === 'admin' ? 'Admin Dashboard' : 'Employee Dashboard'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85, fontSize: '0.85rem' }}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SearchBox>
                <SearchIcon sx={{ opacity: 0.9 }} />
                <InputBase
                  placeholder="Search..."
                  sx={{
                    ml: 1,
                    color: 'white',
                    '::placeholder': { opacity: 0.9 },
                    minWidth: '180px',
                  }}
                />
              </SearchBox>

              <Tooltip title="Notifications" arrow>
  <IconButton
    color="inherit"
    onClick={handleNotifOpen}
    sx={{
      bgcolor: 'rgba(255,255,255,0.12)',
      transition: 'all 0.3s ease',
      '&:hover': {
        bgcolor: 'rgba(255,255,255,0.2)',
        transform: 'scale(1.1)',
      },
    }}
  >
    <Badge badgeContent={notifications.length} color="error">
      <NotificationsIcon />
    </Badge>
  </IconButton>
</Tooltip>


              <Tooltip title="Settings" arrow>
                <IconButton
                  color="inherit"
                  onClick={() => setOpenConfig(true)}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.12)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'rotate(90deg) scale(1.1)',
                    },
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Logout" arrow>
                <IconButton
                  color="inherit"
                  onClick={handleLogout}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.12)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

{/* ✅ Notifications Dropdown */}
<Menu
  anchorEl={anchorNotif}
  open={Boolean(anchorNotif)}
  onClose={handleNotifClose}
  PaperProps={{
    sx: {
      borderRadius: 2,
      mt: 1,
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      minWidth: 260,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(8px)',
    },
  }}
>
  {notifications.length > 0 ? (
    notifications.map((notif) => (
      <MenuItem key={notif.id} onClick={handleNotifClose}>
        <ListItemText
          primary={notif.message}
          secondary={notif.time}
          primaryTypographyProps={{
            fontWeight: 600,
            fontSize: '0.95rem',
          }}
          secondaryTypographyProps={{
            fontSize: '0.8rem',
            color: 'text.secondary',
          }}
        />
      </MenuItem>
    ))
  ) : (
    <MenuItem disabled>
      <ListItemText primary="No notifications" />
    </MenuItem>
  )}
</Menu>
        {/* BODY */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
          {role === 'admin' ? (
            <>
              {/* Enhanced Stats Card */}
              <Fade in timeout={600}>
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      mb: 1, 
      mt: 1, 
    }}
  >
    <StatsCard
      sx={{
        width: 360,     
        height: 125,    
        ml: 0,          
      }}
    >


      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.8 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
          }}
        >
          <PeopleIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.5px', mb: 0.3 }}>
            {data.totalEmployees || 0}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600 }}>
            Total Employees
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <TrendingUpIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Active workforce
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </StatsCard>
  </Box>
</Fade>


              {/* Enhanced Filter Controls */}
              <Fade in timeout={800}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 2,
                    mb: 3,
                    flexWrap: 'wrap',
                  }}
                >
                  <TextField
                    label="Search users"
                    variant="outlined"
                    size="small"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value.toLowerCase())}
                    sx={{
                      width: 240,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(45, 159, 71, 0.15)',
                        },
                      },
                    }}
                  />

                  <TextField
                    label="Filter by role"
                    variant="outlined"
                    size="small"
                    select
                    SelectProps={{ native: true }}
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    sx={{
                      width: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(45, 159, 71, 0.15)',
                        },
                      },
                    }}
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                  </TextField>

                  <Button
                    onClick={openAddModal}
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 700,
                      px: 3,
                      py: 1.2,
                      borderRadius: 2.5,
                      boxShadow: '0 6px 20px rgba(45, 159, 71, 0.35)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(45, 159, 71, 0.45)',
                      },
                    }}
                  >
                    Add New Member
                  </Button>
                </Box>
              </Fade>

              {/* Enhanced Recent Login Activity Card */}
              <Fade in timeout={1000}>
                <GlassCard sx={{ p: 3.5, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '14px',
                          background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 6px 20px rgba(45, 159, 71, 0.3)',
                        }}
                      >
                        <TimeIcon sx={{ color: 'white', fontSize: 28 }} />
                      </Box>
                      <Box>
                        <Typography variant="h5" fontWeight="700" color="text.primary" sx={{ mb: 0.3 }}>
                          Recent Login Activity
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                          Latest user sessions
                        </Typography>
                      </Box>
                    </Box>
                    <AnimatedChip
                      label={`${hasLogins ? data.recentLogins.length : 0} Active`}
                      icon={<CheckCircleIcon sx={{ color: 'white !important' }} />}
                    />
                  </Box>

                  {hasLogins ? (
                    <List sx={{ bgcolor: 'transparent' }}>
                      {data.recentLogins
                        .filter((user) => {
                          const matchText =
                            user.name?.toLowerCase().includes(filterText) ||
                            user.email?.toLowerCase().includes(filterText);
                          const matchRole = filterRole === 'all' || user.role === filterRole;
                          return matchText && matchRole;
                        })
                        .map((user, index) => (
                          <Zoom in timeout={300 + index * 100} key={index}>
                            <StyledListItem>
                              <Avatar
                                sx={{
                                  background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                                  mr: 2.5,
                                  width: 52,
                                  height: 52,
                                  boxShadow: '0 4px 12px rgba(45, 159, 71, 0.3)',
                                }}
                              >
                                <PersonIcon sx={{ fontSize: 26 }} />
                              </Avatar>
<ListItemText
  primaryTypographyProps={{ component: 'div' }}
  secondaryTypographyProps={{ component: 'span' }}
  primary={
    <Typography
      component="div"
      fontWeight="700"
      sx={{ fontSize: '1.1rem', mb: 0.5 }}
    >
      {user.name}
    </Typography>
  }
  secondary={
    <Box
      component="div"
      sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}
    >
      <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
      <Typography
        component="span"
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: '0.95rem' }}
      >
        {user.last_login
          ? new Date(user.last_login).toLocaleString()
          : 'Never logged in'}
      </Typography>
    </Box>
  }
/>


                            </StyledListItem>
                          </Zoom>
                        ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <TimeIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.4 }} />
                      <Typography color="text.secondary" sx={{ fontSize: '1.05rem', fontWeight: 500 }}>
                        No recent logins available.
                      </Typography>
                    </Box>
                  )}
                </GlassCard>
              </Fade>

              {/* Enhanced All Users Table */}
              <Fade in timeout={1200}>
                <GlassCard sx={{ p: 3.5, minHeight: 480 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 6px 20px rgba(45, 159, 71, 0.3)',
                      }}
                    >
                      <PeopleIcon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Typography variant="h5" fontWeight="700" color="text.primary">
                      All Users
                    </Typography>
                  </Box>

                  <TableContainer
  component={GlassPaper}
  sx={{
    maxHeight: 800,
    overflowY: 'auto',
    '& .MuiTableCell-root': {
      fontSize: '1.1rem', // ⬅️ Bigger text
      py: 2.5, // ⬅️ More vertical spacing
    },
    '& .MuiTableHead-root .MuiTableCell-root': {
      fontSize: '1.15rem', // ⬅️ Bigger headers
      fontWeight: 800,
      py: 2.8,
    },
  }}
>
  <Table size="medium" aria-label="users table">

                      <TableHead>
                        <TableRow sx={{ bgcolor: 'rgba(45, 159, 71, 0.08)' }}>
                          <TableCell sx={{ fontWeight: 800, fontSize: '0.95rem', py: 2 }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: 800, fontSize: '0.95rem', py: 2 }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: 800, fontSize: '0.95rem', py: 2 }}>Role</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.95rem', py: 2 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                              <PeopleIcon sx={{ fontSize: 56, opacity: 0.3, mb: 2 }} />
                              <Typography variant="body1" fontWeight={500}>
                                No users found.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          users
                            .filter((u) => {
                              const matchText =
                                u.name?.toLowerCase().includes(filterText) ||
                                u.email?.toLowerCase().includes(filterText);
                              const matchRole = filterRole === 'all' || u.role === filterRole;
                              return matchText && matchRole;
                            })
                            .map((u, idx) => (
                              <Zoom in timeout={200 + idx * 80} key={u.id || u._id}>
                                <StyledTableRow>
                                  <TableCell sx={{ py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                      <Avatar
  sx={{
    width: 55, // ⬅️ larger avatar
    height: 55,
    background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
    boxShadow: '0 4px 12px rgba(45, 159, 71, 0.25)',
  }}
>

                                        <PersonIcon fontSize="small" />
                                      </Avatar>
                                      <Typography fontWeight={700} sx={{ fontSize: '1.1rem' }}>
                                        {u.name}
                                      </Typography>

                                    </Box>
                                  </TableCell>
                                  <TableCell sx={{ py: 2 }}>
                                    <Typography sx={{ fontSize: '1rem' }}>{u.email}</Typography>
                                  </TableCell>
                                  <TableCell sx={{ py: 2 }}>
                                    <Chip
                                      label={u.role || 'employee'}
                                      size="small"
                                      sx={{
                                        textTransform: 'capitalize',
                                        fontWeight: 700,
                                        bgcolor:
                                          u.role === 'admin'
                                            ? 'rgba(45, 159, 71, 0.15)'
                                            : 'rgba(25, 118, 210, 0.15)',
                                        color: u.role === 'admin' ? '#1a7a35' : '#1565c0',
                                        border: `1px solid ${
                                          u.role === 'admin' ? 'rgba(45, 159, 71, 0.3)' : 'rgba(25, 118, 210, 0.3)'
                                        }`,
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="right" sx={{ py: 2 }}>
                                    <Tooltip title="Edit User" arrow>
                                      <ActionIconButton onClick={() => openEditModal(u)} size="medium">
                                        <EditIcon fontSize="small" />
                                      </ActionIconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete User" arrow>
                                      <ActionIconButton
                                        onClick={() => {
                                         setUserToDelete(u);
                                         setConfirmDeleteOpen(true);
                                        }}

                                        size="small"
                                        sx={{
                                          background: 'rgba(211, 47, 47, 0.08)',
                                          '&:hover': {
                                            background: 'rgba(211, 47, 47, 0.15)',
                                          },
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" sx={{ color: '#d32f2f' }} />
                                      </ActionIconButton>
                                    </Tooltip>
                                  </TableCell>
                                </StyledTableRow>
                              </Zoom>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </GlassCard>
              </Fade>
            </>
          ) : (
            /* Enhanced Employee View */
            <Fade in timeout={800}>
              <Box sx={{ maxWidth: 650, mx: 'auto', mt: 6 }}>
                <GlassCard sx={{ p: 5 }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box
                      sx={{
                        width: 110,
                        height: 110,
                        borderRadius: '28px',
                        background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 28px',
                        boxShadow: '0 16px 40px rgba(45, 159, 71, 0.35)',
                        animation: `${float} 4s ease-in-out infinite`,
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 56, color: 'white' }} />
                    </Box>

                    <Typography
                      variant="h3"
                      fontWeight="800"
                      sx={{ mb: 1.5, letterSpacing: '-1px', color: 'text.primary' }}
                    >
                      Welcome Back! 👋
                    </Typography>

                    <Typography variant="h5" color="text.primary" sx={{ mb: 1, fontWeight: 600 }}>
                      {data.name || 'Employee'}
                    </Typography>

                    <Typography color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', fontWeight: 500 }}>
                      Glad to have you on board today
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 4 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2.5,
                        borderRadius: 2.5,
                        bgcolor: 'rgba(45, 159, 71, 0.06)',
                        border: '2px solid rgba(45, 159, 71, 0.15)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(45, 159, 71, 0.1)',
                          transform: 'translateX(8px)',
                          boxShadow: '0 4px 16px rgba(45, 159, 71, 0.15)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2.5,
                          boxShadow: '0 4px 12px rgba(45, 159, 71, 0.3)',
                        }}
                      >
                        <PersonIcon sx={{ color: 'white', fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            mb: 0.5,
                          }}
                        >
                          Full Name
                        </Typography>
                        <Typography fontWeight="700" sx={{ fontSize: '1.1rem' }}>
                          {data.name}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2.5,
                        borderRadius: 2.5,
                        bgcolor: 'rgba(45, 159, 71, 0.06)',
                        border: '2px solid rgba(45, 159, 71, 0.15)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(45, 159, 71, 0.1)',
                          transform: 'translateX(8px)',
                          boxShadow: '0 4px 16px rgba(45, 159, 71, 0.15)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2.5,
                          boxShadow: '0 4px 12px rgba(45, 159, 71, 0.3)',
                        }}
                      >
                        <EmailIcon sx={{ color: 'white', fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            mb: 0.5,
                          }}
                        >
                          Email Address
                        </Typography>
                        <Typography fontWeight="700" sx={{ fontSize: '1.1rem' }}>
                          {data.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2.5,
                        borderRadius: 2.5,
                        bgcolor: 'rgba(45, 159, 71, 0.06)',
                        border: '2px solid rgba(45, 159, 71, 0.15)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(45, 159, 71, 0.1)',
                          transform: 'translateX(8px)',
                          boxShadow: '0 4px 16px rgba(45, 159, 71, 0.15)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2.5,
                          boxShadow: '0 4px 12px rgba(45, 159, 71, 0.3)',
                        }}
                      >
                        <WorkIcon sx={{ color: 'white', fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            mb: 0.5,
                          }}
                        >
                          Role
                        </Typography>
                        <Chip
                          label={data.role}
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            height: 32,
                            bgcolor: 'rgba(45, 159, 71, 0.15)',
                            color: '#1a7a35',
                            border: '1px solid rgba(45, 159, 71, 0.3)',
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </GlassCard>
              </Box>
            </Fade>
          )}
        </Box>
      </Box>

      {/* Enhanced Add/Edit User Modal */}
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
            color: 'white',
            py: 2.5,
          }}
        >
          {editingUser ? '✏️ Edit User' : '➕ Add New Member'}
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Box sx={{ display: 'grid', gap: 2.5, mt: 1 }}>
            <TextField
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              fullWidth
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(45, 159, 71, 0.1)',
                  },
                },
              }}
            />
            <TextField
              label="Email Address"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              type="email"
              fullWidth
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(45, 159, 71, 0.1)',
                  },
                },
              }}
            />

            {!editingUser && (
              <>
                <TextField
                  label="Password"
                  name="password"
                  value={form.password || ''}
                  onChange={handleFormChange}
                  type="password"
                  fullWidth
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(45, 159, 71, 0.1)',
                      },
                    },
                  }}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  value={form.confirmPassword || ''}
                  onChange={handleFormChange}
                  type="password"
                  fullWidth
                  required
                  variant="outlined"
                  error={form.confirmPassword && form.confirmPassword !== form.password}
                  helperText={
                    form.confirmPassword && form.confirmPassword !== form.password
                      ? '❌ Passwords do not match'
                      : ''
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(45, 159, 71, 0.1)',
                      },
                    },
                  }}
                />
              </>
            )}

            <TextField
              label="User Role"
              name="role"
              value={form.role}
              onChange={handleFormChange}
              select
              SelectProps={{ native: true }}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(45, 159, 71, 0.1)',
                  },
                },
              }}
            >
              <option value="admin">Administrator</option>
              <option value="employee">Employee</option>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1.5 }}>
          <Button
            onClick={closeModal}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.2,
              fontWeight: 700,
              textTransform: 'none',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveUser}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
              borderRadius: 2,
              px: 3,
              py: 1.2,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 6px 20px rgba(45, 159, 71, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(45, 159, 71, 0.4)',
              },
            }}
          >
            {editingUser ? 'Update User' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Change Password Dialog */}
      <Dialog
        open={openConfig}
        onClose={() => setOpenConfig(false)}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
            color: 'white',
            py: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <SecurityIcon sx={{ fontSize: 28 }} />
          Change Password
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Box sx={{ display: 'grid', gap: 2.5, mt: 1 }}>
            <TextField
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              fullWidth
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(45, 159, 71, 0.1)',
                  },
                },
              }}
            />
            <TextField
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              fullWidth
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(45, 159, 71, 0.1)',
                  },
                },
              }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              fullWidth
              required
              variant="outlined"
              error={passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword}
              helperText={
                passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword
                  ? '❌ Passwords do not match'
                  : ''
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(45, 159, 71, 0.1)',
                  },
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1.5 }}>
          <Button
            onClick={() => setOpenConfig(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.2,
              fontWeight: 700,
              textTransform: 'none',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
              borderRadius: 2,
              px: 3,
              py: 1.2,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 6px 20px rgba(45, 159, 71, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(45, 159, 71, 0.4)',
              },
            }}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

{/* 🗑️ Confirm Delete Dialog */}
<Dialog
  open={confirmDeleteOpen}
  onClose={() => setConfirmDeleteOpen(false)}
  TransitionComponent={Zoom}
  PaperProps={{
    sx: {
      borderRadius: 3,
      boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    },
  }}
>
  <DialogTitle
    sx={{
      background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
      color: 'white',
      fontWeight: 700,
      py: 2.5,
    }}
  >
    Confirm Deletion
  </DialogTitle>

  <DialogContent sx={{ pt: 3, pb: 1 }}>
    <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
      Are you sure you want to delete{' '}
      <strong>{userToDelete?.name || 'this user'}</strong>?
    </Typography>
  </DialogContent>

  <DialogActions sx={{ p: 2.5 }}>
    <Button
      onClick={() => setConfirmDeleteOpen(false)}
      variant="outlined"
      sx={{
        borderRadius: 2,
        px: 3,
        py: 1,
        fontWeight: 700,
        textTransform: 'none',
      }}
    >
      Cancel
    </Button>

    <Button
      onClick={async () => {
        if (!userToDelete) return;
        await handleDeleteUser(userToDelete);
        setConfirmDeleteOpen(false);
      }}
      variant="contained"
      sx={{
        background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
        borderRadius: 2,
        px: 3,
        py: 1,
        fontWeight: 700,
        textTransform: 'none',
        boxShadow: '0 6px 20px rgba(211, 47, 47, 0.3)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(211, 47, 47, 0.4)',
        },
      }}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>

      {/* Enhanced Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
  onClose={() => setToast((t) => ({ ...t, open: false }))}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  TransitionComponent={(props) => <Slide {...props} direction="up" />}  
  message={toast.message}
  ContentProps={{
    sx: {
      backgroundColor:
        toast.severity === 'success'
          ? '#2d9f47'
          : toast.severity === 'error'
          ? '#d32f2f'
          : '#1976d2',
      color: 'white',
      fontWeight: 600,
      letterSpacing: 0.3,
      textTransform: 'capitalize',
    },
  }}
/>
</Box>
);
}

