import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  InputBase,
  Badge,
  Avatar,
  Stack,
} from '@mui/material';
import {
  PictureAsPdf as PictureAsPdfIcon,
  GridOn as CsvIcon,
  ExitToApp as LogoutIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';

const BASE_URL = 'http://localhost:5000/api';
const drawerWidth = 220;

// ====== STYLES ======
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

const ExportButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.2, 3),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
  '&:hover': { transform: 'translateY(-2px)' },
}));

export default function ReportsPage() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      setError('Access denied: Only admins can view reports.');
      setLoading(false);
      return;
    }

    axios
      .get(`${BASE_URL}/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load employee reports. Please try again.');
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/admin-dashboard');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Employees Report', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Name', 'Role', 'Email', 'Last Login']],
      body: employees.map((e) => [
        e.name,
        e.role,
        e.email,
        e.last_login || 'Never',
      ]),
    });
    doc.save('employees-report.pdf');
  };

  const exportToCSV = () => {
    const rows = [
      ['Name', 'Role', 'Email', 'Last Login'],
      ...employees.map((e) => [
        e.name,
        e.role,
        e.email,
        e.last_login || 'Never',
      ]),
    ];
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'employees-report.csv';
    a.click();
  };

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

  if (loading) {
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
          Loading reports...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f7fa' }}>
      {/* ===== SIDEBAR (ORIGINAL COLOR) ===== */}
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
            Reports
          </Typography>

          {/* Removed “View Reports” */}
          <SidebarButton
            fullWidth
            startIcon={<PeopleIcon />}
            component={Link}
            to="/register"
          >
            Register New
          </SidebarButton>
        </Box>

        <Box sx={{ textAlign: 'center', opacity: 0.6, fontSize: 13 }}>
          © 2025 Admin Panel
        </Box>
      </Drawer>

      {/* ===== MAIN CONTENT ===== */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* ===== HEADER ===== */}
        <AppBar position="static" sx={{ bgcolor: '#2d9f47', px: 2 }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit" onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6">Employee Reports</Typography>
            </Box>

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

        {/* ===== BODY ===== */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
          <Box sx={{ mb: 3, p: 3, bgcolor: '#f8faf9', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
              Export Options
            </Typography>
            <Stack direction="row" spacing={2}>
              <ExportButton
                variant="contained"
                startIcon={<PictureAsPdfIcon />}
                onClick={exportToPDF}
                sx={{ background: '#2d9f47', color: 'white' }}
              >
                Export to PDF
              </ExportButton>

              <ExportButton
                variant="outlined"
                startIcon={<CsvIcon />}
                onClick={exportToCSV}
                sx={{ borderColor: '#2d9f47', color: '#2d9f47' }}
              >
                Export to CSV
              </ExportButton>
            </Stack>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#2d9f47' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Last Login</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((emp) => (
                    <TableRow key={emp.id} hover>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>{emp.role}</TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell>{emp.last_login || 'Never'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}
