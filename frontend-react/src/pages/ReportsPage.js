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
  Stack,
  Chip,
  Card,
} from '@mui/material';
import {
  PictureAsPdf as PictureAsPdfIcon,
  GridOn as CsvIcon,
  ExitToApp as LogoutIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  ArrowBack as ArrowBackIcon,
  Assessment as ReportsIcon,
  Dashboard as DashboardIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';

const BASE_URL = 'http://localhost:5000/api';
const drawerWidth = 260;

// ====== ENHANCED STYLES (matching Dashboard) ======
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

const ExportButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  '&:hover': { 
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#f0f9f4',
    transform: 'scale(1.01)',
  },
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

  // ====== EXPORT FUNCTIONS ======
  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleString('en-GB', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : 'Never logged in';

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
        formatDate(e.last_login),
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
        formatDate(e.last_login),
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

  // ====== CONDITIONAL RENDER ======
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

  if (loading) {
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
          Loading reports...
        </Typography>
      </Box>
    );
  }

  // ====== MAIN PAGE ======
  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f7fb' }}>
      {/* ===== SIDEBAR ===== */}
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
          },
        }}
      >
        <Box>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 24px rgba(45, 159, 71, 0.4)',
              }}
            >
              <ReportsIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}
            >
              Reports
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}
            >
              Management System
            </Typography>
          </Box>

          <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', pt: 3, mb: 3 }} />

          <SidebarButton
            fullWidth
            startIcon={<DashboardIcon />}
            onClick={handleBack}
          >
            Dashboard
          </SidebarButton>

          <SidebarButton
            fullWidth
            startIcon={<PeopleIcon />}
            component={Link}
            to="/register"
          >
            Register New
          </SidebarButton>
        </Box>

        <Box>
          <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', pt: 2, mb: 2 }} />
          <Typography sx={{ textAlign: 'center', opacity: 0.5, fontSize: 12 }}>
            © 2025 Admin Panel
          </Typography>
          <Typography sx={{ textAlign: 'center', opacity: 0.4, fontSize: 11, mt: 0.5 }}>
            v2.0.1
          </Typography>
        </Box>
      </Drawer>

      {/* ===== MAIN CONTENT ===== */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* ===== HEADER ===== */}
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                color="inherit" 
                onClick={handleBack}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '-0.5px' }}>
                  Employee Reports
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
              </Box>
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
                    '::placeholder': { opacity: 0.8 }
                  }} 
                />
              </Box>

              <IconButton 
                color="inherit"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
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
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* ===== BODY ===== */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
          {/* Export Options Card */}
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
                  <FileDownloadIcon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="600" color="text.primary">
                    Export Options
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Download reports in your preferred format
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label={`${employees.length} Employees`}
                sx={{
                  background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  height: 36,
                }}
              />
            </Box>

            <Stack direction="row" spacing={2}>
              <ExportButton
                variant="contained"
                startIcon={<PictureAsPdfIcon />}
                onClick={exportToPDF}
                sx={{ 
                  background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1a7a35 0%, #2d9f47 100%)',
                  }
                }}
              >
                Export to PDF
              </ExportButton>

              <ExportButton
                variant="outlined"
                startIcon={<CsvIcon />}
                onClick={exportToCSV}
                sx={{ 
                  borderColor: '#2d9f47', 
                  color: '#2d9f47',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'rgba(45, 159, 71, 0.05)',
                  }
                }}
              >
                Export to CSV
              </ExportButton>
            </Stack>
          </GlassCard>

          {/* Table Card */}
          <GlassCard sx={{ overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', py: 2 }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', py: 2 }}>
                      Role
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', py: 2 }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', py: 2 }}>
                      Last Login
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                        <PeopleIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
                        <Typography color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                          No employees found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    employees.map((emp) => (
                      <StyledTableRow key={emp.id}>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                          {emp.name}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.95rem' }}>
                          <Chip 
                            label={emp.role}
                            size="small"
                            sx={{
                              bgcolor: emp.role === 'admin' ? 'rgba(45, 159, 71, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                              color: emp.role === 'admin' ? '#2d9f47' : 'text.secondary',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.95rem', color: 'text.secondary' }}>
                          {emp.email}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.95rem', color: 'text.secondary' }}>
                          {formatDate(emp.last_login)}
                        </TableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassCard>
        </Box>
      </Box>
    </Box>
  );
}