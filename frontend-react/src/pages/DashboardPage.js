// src/pages/DashboardPage.js
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Slide from '@mui/material/Slide';
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
  Snackbar,
  Fade,
  Zoom,
  Tooltip,
  Menu,
  MenuItem,
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
  Settings as SettingsIcon,
} from '@mui/icons-material';

import { styled, keyframes } from '@mui/material/styles';
import MarabesLogo from '../assets/marabes-logo.png';
import ChartPro from '../components/ChartPro';




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

// 🧭 Period Filter
const [filterPeriod, setFilterPeriod] = useState('week'); // default = this week
const [filterStartDate, setFilterStartDate] = useState('');
const [filterEndDate, setFilterEndDate] = useState('');

// ISO week filter (like ReportsPage)
const currentYear = new Date().getFullYear();
const [filterWeekNumber, setFilterWeekNumber] = useState(0); // 0 = All weeks
const [filterWeekYear, setFilterWeekYear] = useState(currentYear);

// When set (0..6, Monday=0), list is further filtered to that day
const [selectedWeekday, setSelectedWeekday] = useState(null);

const getISOWeekYear = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week: weekNo };
};



// convert Monday-based index (0..6 => Mon..Sun) to JS getDay() (0..6 => Sun..Sat)
const mondayIndexToJsDay = (i) => (i === 6 ? 0 : i + 1);

// current range derived from Period/ISO week/custom

const getActiveDateRange = useCallback(() => {
  const now = new Date();

  if (filterWeekNumber > 0) {
    // ISO week range (Mon..Sun)
    // find Monday of that ISO week/year
    // step 1: Jan 4th is always in week 1; get its Monday
    const jan4 = new Date(Date.UTC(filterWeekYear, 0, 4));
    const jan4Day = jan4.getUTCDay() || 7;
    const week1Monday = new Date(jan4);
    week1Monday.setUTCDate(jan4.getUTCDate() - (jan4Day - 1));

    // step 2: add (week-1)*7 days
    const monday = new Date(week1Monday);
    monday.setUTCDate(week1Monday.getUTCDate() + (filterWeekNumber - 1) * 7);

    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);

    // normalize to local
    const start = new Date(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate());
    const end = new Date(sunday.getUTCFullYear(), sunday.getUTCMonth(), sunday.getUTCDate(), 23, 59, 59, 999);
    return { start, end };
  }

  if (filterPeriod === 'today') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { start, end };
  }

  if (filterPeriod === 'week') {
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1; // Monday start
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    const start = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (filterPeriod === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  }


  // custom
  const start = filterStartDate ? new Date(filterStartDate) : null;
  const end = filterEndDate ? new Date(filterEndDate + 'T23:59:59.999') : null;
  return { start, end };
}, [filterWeekNumber, filterWeekYear, filterPeriod, filterStartDate, filterEndDate]);

const matchesFilters = useCallback(
  (user, { ignoreSelected = false } = {}) => {
    const matchText =
      user.name?.toLowerCase().includes(filterText) ||
      user.email?.toLowerCase().includes(filterText);

    const matchRole = filterRole === 'all' || user.role === filterRole;

    const loginDate = user.last_login ? new Date(user.last_login) : null;
    if (!loginDate) return false;

    // Period / ISO / Custom range
    if (filterWeekNumber > 0) {
      const { week, year } = getISOWeekYear(loginDate);
      if (!(week === Number(filterWeekNumber) && year === Number(filterWeekYear))) return false;
    } else {
      const { start, end } = getActiveDateRange();
      if (start && loginDate < start) return false;
      if (end && loginDate > end) return false;
    }

    // Extra filter: day selected from chart (Mon=0..Sun=6)
    if (!ignoreSelected && selectedWeekday !== null) {
      const jsDayWanted = mondayIndexToJsDay(selectedWeekday); // 1..6,0
      if (loginDate.getDay() !== jsDayWanted) return false;
    }

    return matchText && matchRole;
  },
 [filterText, filterRole, filterWeekNumber, filterWeekYear, selectedWeekday, getActiveDateRange]
);


const [showChart, setShowChart] = useState(false);

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

// --- Show-more for notifications ---
const [showAllNotifs, setShowAllNotifs] = useState(false);
const MAX_NOTIFS = 6;



// --- Notification grouping helpers (robust) ---
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a, b) => startOfDay(a).getTime() === startOfDay(b).getTime();

const labelForDay = (value) => {
  const d = new Date(value);
  if (isNaN(d)) return 'Other';

  const now = new Date();
  const today = startOfDay(now);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(d, today)) return 'Today';
  if (isSameDay(d, yesterday)) return 'Yesterday';

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  if (d >= sevenDaysAgo) {
    return d.toLocaleDateString(undefined, { weekday: 'long' }); // Mon/Tue/etc
  }
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

// Parse to a numeric timestamp; invalid -> -Infinity (so they go last)
const tsOf = (n) => {
  const raw = n.at ?? n.time;
  const d = new Date(raw);
  return isNaN(d) ? -Infinity : d.getTime();
};

const groupNotifications = (list, showAll, max) => {
  // enrich with safe timestamp + label
  const enriched = list.map((n) => {
    const ts = tsOf(n);
    return {
      ...n,
      __ts: ts,
      __label: labelForDay(n.at ?? n.time),
    };
  });

  // sort newest valid on top; legacy (invalid date) at the end
  enriched.sort((a, b) => b.__ts - a.__ts);

  // only slice after we’ve sorted
  const limited = showAll ? enriched : enriched.slice(0, max);

  // group by label
  return limited.reduce((acc, n) => {
    const label = n.__label;
    if (!acc[label]) acc[label] = [];
    acc[label].push(n);
    return acc;
  }, {});
};



// ✅ Listen to updates from other tabs/pages (like ReportsPage)
useEffect(() => {
  const handleStorageChange = (e) => {
    if (role === 'admin' && e.key === 'notifications') {
      setNotifications(JSON.parse(e.newValue || '[]'));
    } else if (role !== 'admin' && e.key === `notifications_${email}`) {
      setNotifications(JSON.parse(e.newValue || '[]'));
    }

    // ✅ Detect export events coming from ReportsPage
    if (e.key === 'export_flag_pdf' || e.key === 'export_flag_csv') {
      const type = e.key === 'export_flag_pdf' ? 'PDF' : 'CSV';
      const notif = {
        id: Date.now(),
        message: `📦 Employees report exported to ${type}`,
        at: new Date().toISOString(),
      };

      // Update state
      setNotifications((prev) => [notif, ...prev]);

      // Update localStorage instantly
      const saved = JSON.parse(localStorage.getItem('notifications') || '[]');
      const updated = [notif, ...saved];
      localStorage.setItem('notifications', JSON.stringify(updated));

       setTimeout(() => localStorage.removeItem(e.key), 500);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, [role, email]);



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

  // ✅ Mark all as read when menu opens
  const updated = notifications.map((n) => ({ ...n, read: true }));
  setNotifications(updated);
};


const handleNotifClose = () => {
  setAnchorNotif(null);
};


  useEffect(() => {
  if (!token) {
    setError('No token found. Please login.');
    return;
  }

  // ✅ Construct ISO week (e.g., 202543)
  const isoWeekParam =
    filterWeekNumber > 0
      ? `${filterWeekYear}${String(filterWeekNumber).padStart(2, '0')}`
      : null;

  axios
    .get(`${BASE_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
      params: isoWeekParam ? { isoWeek: isoWeekParam } : {}, // ✅ attach only if week selected
    })
    .then((res) => {
      setData(res.data);
      setUsers(res.data.allUsers || []);
    })
    .catch(() => setError('Failed to load dashboard. Please login again.'));
}, [token, filterWeekNumber, filterWeekYear]); // ✅ refetch when week changes


  // 🗓️ Automatically select current week when page loads
useEffect(() => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  const today = now.toISOString().split('T')[0];
  const start = monday.toISOString().split('T')[0];

  setFilterStartDate(start);
  setFilterEndDate(today);
}, []);


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

// ✅ Push a new notification (shared across all tabs)
const pushNotification = (message) => {
  const newNotif = {
    id: Date.now(),
    message,
    at: new Date().toISOString(),
  };

  // Update state immediately
  setNotifications((prev) => [newNotif, ...prev]);

  // Persist + trigger cross-tab refresh
  setTimeout(() => {
    const key = role === 'admin' ? 'notifications' : `notifications_${email}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = [newNotif, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  }, 0);
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
pushNotification(
  editingUser
    ? `✏️ User "${form.name}" has been modified.`
    : `✅ New user "${form.name}" has been added.`
);



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

      pushNotification(`🗑️ User "${user.name}" was deleted.`);


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



//  recent login data
const hasLogins =
  Array.isArray(data?.recentLogins) && data.recentLogins.length > 0;

// ✅ Names per day 
const weeklyNamesByDay = useMemo(() => {
  if (!data?.recentLogins) return Array(7).fill(0).map(() => []);
  const names = Array(7).fill(0).map(() => []);

  data.recentLogins.forEach((user) => {
    // same filters as weeklyData (ignoreSelected:true so totals are not constrained by selected weekday)
    if (!matchesFilters(user, { ignoreSelected: true })) return;
    const d = new Date(user.last_login);
    const idx = d.getDay() === 0 ? 6 : d.getDay() - 1; // Monday=0
    names[idx].push(user.name || user.email || 'Unknown');
  });

  // sort names alphabetically for cleaner tooltips 
  return names.map(list => list.sort((a, b) => a.localeCompare(b)));
}, [data, matchesFilters]);

// 🗓️ Weekly login data
const weeklyData = useMemo(() => {
  if (!data?.recentLogins) return { labels: [], datasets: [] };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const counts = Array(7).fill(0);

  data.recentLogins.forEach((user) => {
    // apply text/role + date-range filters; ignore selected weekday for totals
    if (!matchesFilters(user, { ignoreSelected: true })) return;

    const d = new Date(user.last_login);
    const idx = d.getDay() === 0 ? 6 : d.getDay() - 1; // Monday=0
    counts[idx]++;
  });

  return {
    labels: days,
    datasets: [
      {
        label: 'Logins per day',
        data: counts,
        backgroundColor: 'rgba(45, 159, 71, 0.7)',
        borderRadius: 8,
      },
    ],
  };
}, [data, matchesFilters]);

// 📈 Data for <ChartPro/> (kept separate from other hooks)
const chartDataForPro = useMemo(() => {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const counts = weeklyData?.datasets?.[0]?.data || [];
  return days.map((d, i) => ({
    day: d,
    logins: counts[i] || 0,
    names: weeklyNamesByDay[i] || [],
  }));
}, [weeklyData, weeklyNamesByDay]);



// ✅ Then add the conditional returns after
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
    <Badge
  badgeContent={notifications.filter((n) => !n.read).length}
  color="error"
>
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


{/* ✅ Notifications Dropdown Menu */}
<Menu
  anchorEl={anchorNotif}
  open={Boolean(anchorNotif)}
  onClose={handleNotifClose}
  PaperProps={{
    sx: {
      mt: 1.5,
      borderRadius: 3,
      width: 340,
      maxHeight: 400,
      boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
      overflowY: 'auto',
    },
  }}
>
  {notifications.length > 0 ? (
    [
      ...Object.entries(groupNotifications(notifications, showAllNotifs, MAX_NOTIFS)).map(
        ([section, items], sectionIdx, arr) => (
          <Box key={section} sx={{ px: 2, pt: sectionIdx === 0 ? 1 : 2 }}>
            {/* 🗓️ Section Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: 'rgba(45,159,71,0.08)',
              }}
            >
              <TimeIcon sx={{ fontSize: 18, color: '#1a7a35' }} />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  color: '#1a7a35',
                  textTransform: 'capitalize',
                  fontSize: '0.9rem',
                }}
              >
                {section}
              </Typography>
            </Box>

            {/* 🔹 Notifications under this section */}
            {items.map((notif) => (
              <MenuItem
                key={notif.id}
                onClick={handleNotifClose}
                sx={{
                  borderBottom: '1px dashed rgba(0,0,0,0.08)',
                  py: 1,
                  alignItems: 'flex-start',
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.3 }}>
                      {notif.message}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 0.3,
                        color: 'text.secondary',
                        fontSize: '0.78rem',
                      }}
                    >
                      {(() => {
                        const raw = notif.at ?? notif.time;
                        const d = new Date(raw);
                        if (!raw || isNaN(d)) return '(no date)';
                        const dateStr = d.toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        });
                        const timeStr = d.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                        return `${dateStr} – ${timeStr}`;
                      })()}
                    </Typography>
                  }
                />
              </MenuItem>
            ))}

            {sectionIdx < arr.length - 1 && (
              <Divider sx={{ my: 1, borderColor: 'rgba(0,0,0,0.05)' }} />
            )}
          </Box>
        )
      ),

      // 🔽 Replaced Fragment with array
      ...(notifications.length > MAX_NOTIFS
        ? [
            <Divider key="divider-more" />,
            <MenuItem
              key="show-more"
              onClick={() => setShowAllNotifs((v) => !v)}
              sx={{ justifyContent: 'center', fontWeight: 700 }}
            >
              {showAllNotifs ? 'Show less' : `Show ${notifications.length - MAX_NOTIFS} more`}
            </MenuItem>,
          ]
        : []),
    ]
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
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 3,
      mb: 3,
      mt: 1,
    }}
  >
    {/* 🟩 Total Employees */}
    <StatsCard>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <PeopleIcon sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h4" fontWeight="800">{data.totalEmployees || 0}</Typography>
          <Typography variant="body2">Total Employees</Typography>
          <Typography variant="caption">Active workforce</Typography>
        </Box>
      </CardContent>
    </StatsCard>

    {/* 🕓 Logins This Week */}
    <StatsCard sx={{ background: 'linear-gradient(135deg,#15803d,#166534)' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TimeIcon sx={{ fontSize: 38 }} />
        <Box>
          <Typography variant="h4" fontWeight="800">
            {data.recentLogins?.length || 0}
          </Typography>
          <Typography variant="body2">Logins This Week</Typography>
          <Typography variant="caption">Recorded sessions</Typography>
        </Box>
      </CardContent>
    </StatsCard>

    {/* ⚙️ Admin Accounts */}
    <StatsCard sx={{ background: 'linear-gradient(135deg,#0f766e,#115e59)' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <SecurityIcon sx={{ fontSize: 38 }} />
        <Box>
          <Typography variant="h4" fontWeight="800">
            {users.filter(u => u.role === 'admin').length}
          </Typography>
          <Typography variant="body2">Admin Accounts</Typography>
          <Typography variant="caption">System supervisors</Typography>
        </Box>
      </CardContent>
    </StatsCard>

    {/* 📈 Average Weekly Growth */}
    <StatsCard sx={{ background: 'linear-gradient(135deg, #64a78eff 0%, #56997dff 100%)' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TrendingUpIcon sx={{ fontSize: 38 }} />
        <Box>
          <Typography variant="h4" fontWeight="800">
            +{Math.floor(Math.random() * 8) + 2}%
          </Typography>
          <Typography variant="body2">Weekly Growth</Typography>
          <Typography variant="caption">vs. last week</Typography>
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
    {/* 🔍 Search field */}
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

    {/* 🧩 Role filter */}
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


{/* 🧭 Smart Period Filter (disabled when week selected) */}
<TextField
  select
  label="Period"
  value={filterPeriod}
  onChange={(e) => setFilterPeriod(e.target.value)}
  size="small"
  SelectProps={{ native: true }}
  disabled={filterWeekNumber > 0} // disable period when week filter active
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
  <option value="today">Today</option>
  <option value="week">This Week</option>
  <option value="month">This Month</option>
  <option value="custom">Custom Range</option>
</TextField>

{/* 📅 Custom range only if selected */}
{filterPeriod === 'custom' && (
  <>
    <TextField
      label="From"
      type="date"
      size="small"
      value={filterStartDate}
      onChange={(e) => setFilterStartDate(e.target.value)}
      InputLabelProps={{ shrink: true }}
      sx={{ width: 180 }}
    />
    <TextField
      label="To"
      type="date"
      size="small"
      value={filterEndDate}
      onChange={(e) => setFilterEndDate(e.target.value)}
      InputLabelProps={{ shrink: true }}
      sx={{ width: 180 }}
    />
  </>
)}

{/* 📆 ISO Week Number filter */}
<TextField
  select
  label="Week # (ISO)"
  value={filterWeekNumber}
  onChange={(e) => setFilterWeekNumber(Number(e.target.value))}
  size="small"
  SelectProps={{ native: true }}
  sx={{ width: 170 }}
>
  <option value={0}>All Weeks</option>
  {Array.from({ length: 53 }, (_, i) => i + 1).map((w) => (
    <option key={w} value={w}>Week {w}</option>
  ))}
</TextField>

{/* 📅 Year selector */}
<TextField
  select
  label="Year"
  value={filterWeekYear}
  onChange={(e) => setFilterWeekYear(Number(e.target.value))}
  size="small"
  SelectProps={{ native: true }}
  sx={{ width: 120 }}
  disabled={filterWeekNumber === 0}
>
  {Array.from({ length: 6 }, (_, i) => currentYear - 4 + i).map((y) => (
    <option key={y} value={y}>{y}</option>
  ))}
</TextField>

{/* 🔄 Reset to This Week */}
<Button
  variant="outlined"
  color="success"
  onClick={() => {
    const now = new Date();
    const { week, year } = getISOWeekYear(now);
    setFilterWeekNumber(week);  // show current ISO week
    setFilterWeekYear(year);
    setFilterPeriod('week');
    setFilterStartDate('');
    setFilterEndDate('');
  }}
  sx={{
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    px: 2.5,
    py: 1,
  }}
>
  Reset to This Week
</Button>

    {/* ➕ Add New Member */}
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

<Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
  <Button
    variant="outlined"
    startIcon={<TrendingUpIcon />}
    onClick={() => {
      setShowChart(true); // show the chart
      setTimeout(() => {
        const chartSection = document.getElementById('weeklyChartSection');
        if (chartSection) {
          chartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150); // delay ensures fade starts first
    }}
    sx={{
      textTransform: 'none',
      borderRadius: 2,
      px: 2.8,
      fontWeight: 700,
      fontSize: '0.95rem',
      color: '#1a7a35',
      borderColor: '#2d9f47',
      display: showChart ? 'none' : 'flex', // hide button when chart visible
      alignItems: 'center',
      gap: 1,
      '&:hover': {
        backgroundColor: 'rgba(45,159,71,0.08)',
        borderColor: '#1a7a35',
      },
    }}
  >
    View Weekly Overview
  </Button>
</Box>



              {/* Enhanced Recent Login Activity Card */}
              <Fade in timeout={1000}>
                <GlassCard sx={{ p: 3.5, mb: 3 }} data-recent-logins>
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
    .filter((user) => matchesFilters(user))
    .map((user, index) => (
      <Zoom in timeout={300 + index * 100} key={index}>
        <StyledListItem
          sx={{
            position: 'relative',
            '&::after': index < data.recentLogins.length - 1
              ? {
                  content: '""',
                  position: 'absolute',
                  left: 28,
                  bottom: -10,
                  width: '2px',
                  height: '20px',
                  background: 'rgba(45,159,71,0.2)',
                }
              : {},
          }}
        >
          <Avatar
            sx={{
              background: 'linear-gradient(135deg,#2d9f47,#1a7a35)',
              mr: 2.5,
              width: 50,
              height: 50,
            }}
          >
            <PersonIcon sx={{ fontSize: 24 }} />
          </Avatar>
          <ListItemText
            primary={
              <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                {user.name}
              </Typography>
            }
            secondary={
              <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                {user.last_login
                  ? new Date(user.last_login).toLocaleString()
                  : 'Never logged in'}
              </Typography>
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

{/* 📊 Weekly Login Overview */}


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
    borderRadius: 3,
    boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
    '&::-webkit-scrollbar': { width: 8 },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(45,159,71,0.25)',
      borderRadius: 10,
    },
  }}
>
  <Table stickyHeader aria-label="users table">
    <TableHead>
      <TableRow
        sx={{
          bgcolor: 'rgba(45,159,71,0.06)',
          '& th': {
            fontWeight: 800,
            color: '#1a1a1a',
            fontSize: '0.95rem',
            borderBottom: '2px solid rgba(45,159,71,0.1)',
            py: 1.8,
          },
        }}
      >
        <TableCell>Name</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Role</TableCell>
        <TableCell align="right">Actions</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {users.length === 0 ? (
        <TableRow>
          <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
            <PeopleIcon sx={{ fontSize: 56, opacity: 0.3, mb: 1 }} />
            <Typography variant="body1" fontWeight={500} color="text.secondary">
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
              <StyledTableRow
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: 'rgba(45,159,71,0.02)' },
                  '&:hover': {
                    backgroundColor: 'rgba(45,159,71,0.08)',
                    transform: 'scale(1.01)',
                  },
                }}
              >
                <TableCell sx={{ py: 1.8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                        boxShadow: '0 3px 10px rgba(45,159,71,0.25)',
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Typography fontWeight={700} sx={{ fontSize: '1rem' }}>
                      {u.name}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ py: 1.8 }}>
                  <Typography sx={{ fontSize: '0.95rem' }}>{u.email}</Typography>
                </TableCell>

                <TableCell sx={{ py: 1.8 }}>
                  <Chip
                    label={u.role || 'employee'}
                    size="small"
                    sx={{
                      textTransform: 'capitalize',
                      fontWeight: 700,
                      bgcolor:
                        u.role === 'admin'
                          ? 'rgba(45,159,71,0.12)'
                          : 'rgba(25,118,210,0.12)',
                      color: u.role === 'admin' ? '#1a7a35' : '#1565c0',
                      border: `1px solid ${
                        u.role === 'admin'
                          ? 'rgba(45,159,71,0.3)'
                          : 'rgba(25,118,210,0.3)'
                      }`,
                    }}
                  />
                </TableCell>

                <TableCell align="right" sx={{ py: 1.8 }}>
                  <Tooltip title="Edit User" arrow>
                    <ActionIconButton onClick={() => openEditModal(u)} size="small">
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
                        background: 'rgba(211,47,47,0.08)',
                        '&:hover': { background: 'rgba(211,47,47,0.15)' },
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
{/* 📊 Weekly Login Overview (moved below tables) */}
{showChart && (
  <div id="weeklyChartSection">
    <Fade in={showChart} timeout={800}>
      <ChartPro
        data={chartDataForPro}
        show={showChart}
        onToggleShow={setShowChart}
        selectedIndex={selectedWeekday}
        onBarClick={(idx) => {
          setSelectedWeekday(idx); 
          const el = document.querySelector('[data-recent-logins]');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        title="Weekly Login Overview"
        subtitle="Daily login activity trends"
      />
    </Fade>
  </div>
)}



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
>
  <Alert
    onClose={() => setToast((t) => ({ ...t, open: false }))}
    severity={
      toast.severity === 'error'
        ? 'error'
        : toast.severity === 'success'
        ? 'success'
        : 'info'
    }
    variant="filled"
    sx={{
      color: 'white',
      bgcolor:
        toast.severity === 'success'
          ? '#2d9f47'
          : toast.severity === 'error'
          ? '#d32f2f'
          : '#d2c619ff',
      fontWeight: 600,
      letterSpacing: 0.3,
      textTransform: 'capitalize',
    }}
  >
    {toast.message}
  </Alert>
</Snackbar>
</Box>
);
}

