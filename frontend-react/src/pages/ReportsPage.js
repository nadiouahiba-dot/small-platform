// src/pages/ReportsPage.js
import React, { useEffect, useMemo, useState } from 'react';
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
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  InputBase,
  Badge,
  Stack,
  Chip,
  Card,
  TextField,
  Tooltip,
  Fade,
  Zoom,
} from '@mui/material';
import {
  PictureAsPdf as PictureAsPdfIcon,
  GridOn as CsvIcon,
  ExitToApp as LogoutIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  ArrowBack as ArrowBackIcon,
  Dashboard as DashboardIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import MarabesLogo from '../assets/marabes-logo.png';

const BASE_URL = 'http://localhost:5000/api';
const drawerWidth = 280;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

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
    '&::before': { transform: 'scaleY(1)' },
    '& .MuiSvgIcon-root': { transform: 'scale(1.15)' },
  },
  '& .MuiSvgIcon-root': { transition: 'transform 0.3s ease' },
}));

const ExportButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2.5),
  padding: theme.spacing(1.8, 3.5),
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.95rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' },
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(30px)',
  borderRadius: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.4)',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': { boxShadow: '0 16px 50px rgba(0, 0, 0, 0.12)', transform: 'translateY(-2px)' },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(45, 159, 71, 0.05)',
    transform: 'scale(1.01)',
    boxShadow: '0 4px 12px rgba(45, 159, 71, 0.1)',
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
  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
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
  '&:hover': { transform: 'scale(1.05)' },
}));

export default function ReportsPage() {
  const [employees, setEmployees] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [filterPeriod, setFilterPeriod] = useState('week');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const currentYear = new Date().getFullYear();
  const [filterWeekNumber, setFilterWeekNumber] = useState(0); // 0 = All weeks
  const [filterWeekYear, setFilterWeekYear] = useState(currentYear);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      setError('Access denied: Only admins can view reports.');
      setLoading(false);
      return;
    }
    axios
      .get(`${BASE_URL}/reports`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load employee reports. Please try again.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    setFilterPeriod('week');
    setFilterStartDate(monday.toISOString().split('T')[0]);
    setFilterEndDate(now.toISOString().split('T')[0]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleBack = () => navigate('/admin-dashboard');

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
      : 'Never logged in';

  const getISOWeekYear = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return { year: d.getUTCFullYear(), week: weekNo };
  };

  const periodLabel = () => {
    if (filterWeekNumber > 0) return ` (ISO Week ${filterWeekNumber}, ${filterWeekYear})`;
    if (filterPeriod === 'custom') {
      const a = filterStartDate || '...';
      const b = filterEndDate || '...';
      return ` (${a} → ${b})`;
    }
    return { today: ' (Today)', week: ' (This Week)', month: ' (This Month)' }[filterPeriod] || '';
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchText =
        (emp.name || '').toLowerCase().includes(filterText) ||
        (emp.email || '').toLowerCase().includes(filterText);

      const matchRole = filterRole === 'all' || emp.role === filterRole;

      const loginDate = emp.last_login ? new Date(emp.last_login) : null;
      const now = new Date();

      let matchPeriod = true;

      if (filterWeekNumber > 0) {
        if (!loginDate) return false;
        const { week, year } = getISOWeekYear(loginDate);
        matchPeriod = week === Number(filterWeekNumber) && year === Number(filterWeekYear);
      } else if (filterPeriod === 'today') {
        matchPeriod = !!loginDate && loginDate.toDateString() === now.toDateString();
      } else if (filterPeriod === 'week') {
        const dow = now.getDay();
        const diff = dow === 0 ? 6 : dow - 1;
        const monday = new Date(now);
        monday.setDate(now.getDate() - diff);
        monday.setHours(0, 0, 0, 0);
        matchPeriod = !!loginDate && loginDate >= monday;
      } else if (filterPeriod === 'month') {
        matchPeriod =
          !!loginDate &&
          loginDate.getMonth() === now.getMonth() &&
          loginDate.getFullYear() === now.getFullYear();
      } else if (filterPeriod === 'custom') {
        const startOk = !filterStartDate || (loginDate && loginDate >= new Date(filterStartDate));
        const endOk = !filterEndDate || (loginDate && loginDate <= new Date(filterEndDate));
        matchPeriod = startOk && endOk;
      }

      return matchText && matchRole && matchPeriod;
    });
  }, [
    employees,
    filterText,
    filterRole,
    filterPeriod,
    filterStartDate,
    filterEndDate,
    filterWeekNumber,
    filterWeekYear,
  ]);

  const loadImage = (src) =>
    new Promise((res, rej) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = src;
    });

  const GREEN_DARK = [26, 122, 53];
  const GREEN = [45, 159, 71];
  const GREY_BORDER = [230, 234, 239];
  const mm = (v) => v;

  const exportToPDF = async () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const left = mm(14);
    const right = mm(14);
    const top = mm(16);
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setProperties({ title: 'Employees Report', subject: 'Employees last-login report', author: 'Marabes Admin' });
    try {
  const logo = await loadImage(MarabesLogo);
  doc.addImage(logo, 'PNG', left - 1, top - 4, 14, 14);
} catch {}

doc.setTextColor(17, 24, 39);
doc.setFont('helvetica', 'bold');
doc.setFontSize(16);
doc.text(`Employees Report${periodLabel()}`, left + 16, top + 2);


    autoTable(doc, {
      startY: top + 18,
      head: [['Name', 'Role', 'Email', 'Last Login']],
      body: filteredEmployees.map((e) => [e.name || '', e.role || '', e.email || '', formatDate(e.last_login)]),
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 6, lineColor: GREY_BORDER, lineWidth: 0.2, valign: 'middle' },
      headStyles: { fillColor: GREEN_DARK, textColor: 255, fontStyle: 'bold', halign: 'left' },
      bodyStyles: { textColor: [31, 41, 55] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      columnStyles: { 0: { cellWidth: 45 }, 1: { cellWidth: 25, halign: 'left' }, 2: { cellWidth: 70 }, 3: { cellWidth: 40 } },
      margin: { left, right },
      tableWidth: pageWidth - left - right,
      theme: 'grid',
      didDrawPage: () => {
        const page = doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text(`Page ${page}`, pageWidth - right, doc.internal.pageSize.getHeight() - 8, { align: 'right' });
        doc.setDrawColor(...GREEN);
        doc.setLineWidth(0.6);
        doc.line(left - 4, top - 6, pageWidth - right + 4, top - 6);
        doc.setLineWidth(0.2);
        doc.setDrawColor(...GREY_BORDER);
      },
    });

    doc.save('employees-report.pdf');

    const newNotif = { id: Date.now(), message: '📄 Employees report exported to PDF', time: new Date().toLocaleTimeString() };
    const existing = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify([newNotif, ...existing].slice(0, 15)));
  };

  const exportToCSV = () => {
    const DELIM = ',';
    const EOL = '\r\n';
    const csvEscape = (val) => {
      if (val === null || val === undefined) return '""';
      const s = String(val).replace(/"/g, '""');
      return `"${s}"`;
    };
    const rows = [
      [`Employees Report${periodLabel()}`],
      [],
      ['Name', 'Role', 'Email', 'Last Login'],
      ...filteredEmployees.map((e) => [e.name || '', e.role || '', e.email || '', formatDate(e.last_login)]),
    ];
    const csvString = '\uFEFF' + rows.map((r) => r.map(csvEscape).join(DELIM)).join(EOL);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'employees-report.csv';
    a.click();
    const newNotif = { id: Date.now(), message: '📊 Employees report exported to CSV', time: new Date().toLocaleTimeString() };
    const existing = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify([newNotif, ...existing].slice(0, 15)));
  };

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          sx={{ background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)', textTransform: 'none', px: 3, py: 1.5, borderRadius: 2 }}
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
        <CircularProgress size={70} thickness={4} sx={{ color: 'white' }} />
        <Typography variant="h6" sx={{ mt: 3, color: 'white', fontWeight: 600 }}>
          Loading reports...
        </Typography>
      </Box>
    );
  }

  const weekOptions = Array.from({ length: 53 }, (_, i) => i + 1);
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - 4 + i);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
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
                <Box component="img" src={MarabesLogo} alt="Marabes Logo" sx={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '20px' }} />
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px', mb: 0.5 }}>
                Reports
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.7rem' }}
              >
                Management System
              </Typography>
            </Box>
          </Zoom>

          <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', pt: 3, mb: 3 }} />

          <Fade in timeout={1000}>
            <Box>
              <SidebarButton fullWidth startIcon={<DashboardIcon />} onClick={handleBack}>
                Dashboard
              </SidebarButton>
            </Box>
          </Fade>
        </Box>

        <Box>
          <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', pt: 2, mb: 2 }} />
          <Typography sx={{ textAlign: 'center', opacity: 0.4, fontSize: 11, fontWeight: 500 }}>© 2025 Admin Panel</Typography>
          <Typography sx={{ textAlign: 'center', opacity: 0.3, fontSize: 10, mt: 0.5 }}>v2.1.0 Pro</Typography>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', zIndex: 1 }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="Back to Dashboard" arrow>
                <IconButton
                  color="inherit"
                  onClick={handleBack}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.12)',
                    transition: 'all 0.3s ease',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', transform: 'scale(1.1)' },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                  Employee Reports
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85, fontSize: '0.85rem' }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SearchBox>
                <SearchIcon sx={{ opacity: 0.9 }} />
                <InputBase
                  placeholder="Search..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value.toLowerCase())}
                  sx={{ ml: 1, color: 'white', '::placeholder': { opacity: 0.9 }, minWidth: '180px' }}
                />
              </SearchBox>

              <Tooltip title="Notifications" arrow>
                <IconButton
                  color="inherit"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.12)',
                    transition: 'all 0.3s ease',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', transform: 'scale(1.1)' },
                  }}
                >
                  <Badge badgeContent={2} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Logout" arrow>
                <IconButton
                  color="inherit"
                  onClick={handleLogout}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.12)',
                    transition: 'all 0.3s ease',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', transform: 'scale(1.1)' },
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
          <Fade in timeout={600}>
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
                    <FileDownloadIcon sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="700" color="text.primary" sx={{ mb: 0.3 }}>
                      Export Options
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                      Download reports in your preferred format
                    </Typography>
                  </Box>
                </Box>
                <AnimatedChip label={`${employees.length} Employees`} />
              </Box>

              <Stack direction="row" spacing={2}>
                <ExportButton
                  variant="contained"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={exportToPDF}
                  sx={{
                    background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)',
                    color: 'white',
                    '&:hover': { background: 'linear-gradient(135deg, #1a7a35 0%, #2d9f47 100%)' },
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
                    '&:hover': { borderWidth: 2, backgroundColor: 'rgba(45, 159, 71, 0.05)' },
                  }}
                >
                  Export to CSV
                </ExportButton>
              </Stack>
            </GlassCard>
          </Fade>

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
                label="Search employees"
                variant="outlined"
                size="small"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value.toLowerCase())}
                sx={{
                  width: 240,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: '0 4px 12px rgba(45,159,71,0.15)' },
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
                    '&:hover': { boxShadow: '0 4px 12px rgba(45,159,71,0.15)' },
                  },
                }}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </TextField>

              <TextField
                select
                label="Period"
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                size="small"
                SelectProps={{ native: true }}
                disabled={filterWeekNumber > 0}
                sx={{
                  width: 200,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: '0 4px 12px rgba(45,159,71,0.15)' },
                  },
                }}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </TextField>

              {filterPeriod === 'custom' && filterWeekNumber === 0 && (
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
                {weekOptions.map((w) => (
                  <option key={w} value={w}>
                    Week {w}
                  </option>
                ))}
              </TextField>

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
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </TextField>

              <Button
                variant="outlined"
                color="success"
                onClick={() => {
                  const now = new Date();
                  const { week, year } = getISOWeekYear(now);  // you already have this helper above
                  setFilterWeekNumber(week);                    // ← set the current ISO week
                  setFilterWeekYear(year);                      // ← set the matching year
                  setFilterPeriod('week');                      // period select will be disabled when weekNumber > 0
                  setFilterStartDate('');                       // optional: clear custom dates
                  setFilterEndDate('');                         // optional: clear custom dates
                }}

                sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none', px: 2.5, py: 1 }}
              >
                Reset to This Week
              </Button>
            </Box>
          </Fade>

          <Fade in timeout={1000}>
            <GlassCard sx={{ overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)' }}>
                      {['Name', 'Role', 'Email', 'Last Login'].map((h) => (
                        <TableCell key={h} sx={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', py: 3 }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEmployees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                          <PeopleIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.4 }} />
                          <Typography color="text.secondary" sx={{ fontSize: '1.05rem', fontWeight: 500 }}>
                            No employees found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEmployees.map((emp, idx) => (
                        <Zoom in timeout={200 + idx * 80} key={emp.id ?? emp.email ?? idx}>
                          <StyledTableRow>
                            <TableCell sx={{ fontWeight: 700, fontSize: '1.05rem', py: 2.5 }}>
                              {emp.name}
                            </TableCell>
                            <TableCell sx={{ fontSize: '1.05rem', py: 2.5 }}>
                              <Chip
                                label={emp.role}
                                size="medium"
                                sx={{
                                  textTransform: 'capitalize',
                                  fontWeight: 700,
                                  fontSize: '0.9rem',
                                  bgcolor:
                                    emp.role === 'admin'
                                      ? 'rgba(45, 159, 71, 0.15)'
                                      : 'rgba(25, 118, 210, 0.15)',
                                  color: emp.role === 'admin' ? '#1a7a35' : '#1565c0',
                                  border: `1px solid ${
                                    emp.role === 'admin'
                                      ? 'rgba(45, 159, 71, 0.3)'
                                      : 'rgba(25, 118, 210, 0.3)'
                                  }`,
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ fontSize: '1.05rem', color: 'text.secondary', py: 2.5 }}>
                              {emp.email}
                            </TableCell>
                            <TableCell sx={{ fontSize: '1.05rem', color: 'text.secondary', py: 2.5 }}>
                              {formatDate(emp.last_login)}
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
        </Box>
      </Box>
    </Box>
  );
}
