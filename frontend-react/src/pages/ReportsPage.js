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

// ====== ENHANCED STYLES ======
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

const ExportButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2.5),
  padding: theme.spacing(1.8, 3.5),
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.95rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
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

export default function ReportsPage() {
  const [employees, setEmployees] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🧭 Period Filter (same as Dashboard)
const [filterPeriod, setFilterPeriod] = useState('week'); // default = this week
const [filterStartDate, setFilterStartDate] = useState('');
const [filterEndDate, setFilterEndDate] = useState('');


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

  // 🗓️ Auto-select current week on load (Dashboard-style)
useEffect(() => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday start
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);

  setFilterPeriod('week'); // keep UI in sync with Dashboard
  setFilterStartDate(monday.toISOString().split('T')[0]);
  setFilterEndDate(now.toISOString().split('T')[0]);
}, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/admin-dashboard');
  };



  // ===== EXPORTS =====
  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleString('en-GB', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : 'Never logged in';

// ----- central filter + label (use these everywhere) -----
const periodLabel = () => {
  if (filterPeriod === 'custom') {
    const a = filterStartDate || '...';
    const b = filterEndDate || '...';
    return ` (${a} → ${b})`;
  }
  return {
    today: ' (Today)',
    week: ' (This Week)',
    month: ' (This Month)',
  }[filterPeriod] || '';
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
    if (filterPeriod === 'today') {
      matchPeriod = !!loginDate && loginDate.toDateString() === now.toDateString();
    } else if (filterPeriod === 'week') {
      const dow = now.getDay();
      const diff = dow === 0 ? 6 : dow - 1; // Monday start
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
      const endOk   = !filterEndDate   || (loginDate && loginDate <= new Date(filterEndDate));
      matchPeriod = startOk && endOk;
    }

    return matchText && matchRole && matchPeriod;
  });
}, [employees, filterText, filterRole, filterPeriod, filterStartDate, filterEndDate]);



// put this helper above exportToPDF
const loadImage = (src) =>
  new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });

const GREEN_DARK = [26, 122, 53]; // #1a7a35
const GREEN = [45, 159, 71];      // #2d9f47
const GREY_BORDER = [230, 234, 239]; // light grey to match app cards

const mm = (v) => v; // (jsPDF default unit is mm)

const exportToPDF = async () => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const left = mm(14);
  const right = mm(14);
  const top = mm(16);
  const pageWidth = doc.internal.pageSize.getWidth();

  // metadata
  doc.setProperties({
    title: 'Employees Report',
    subject: 'Employees last-login report',
    author: 'Marabes Admin',
  });

  // header “glass card” strip
  doc.setDrawColor(...GREY_BORDER);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(left - 4, top - 6, pageWidth - left - right + 8, 24, 3, 3, 'FD');

  // logo (optional; will skip if it fails to load)
  try {
    const logo = await loadImage(MarabesLogo);
    doc.addImage(logo, 'PNG', left - 1, top - 4, 14, 14);
  } catch {}

  // title + subtitle
  doc.setTextColor(17, 24, 39); // slate-900-ish
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(`Employees Report${periodLabel()}`, left + 16, top + 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500-ish
  doc.text(
    `Generated ${new Date().toLocaleString()}`,
    left + 16,
    top + 8
  );

  // table
  autoTable(doc, {
    startY: top + 18,
    head: [['Name', 'Role', 'Email', 'Last Login']],
    body: filteredEmployees.map((e) => [
      e.name || '',
      e.role || '',
      e.email || '',
      formatDate(e.last_login),
    ]),
    // global styles
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 6,
      lineColor: GREY_BORDER,
      lineWidth: 0.2,
      valign: 'middle',
    },
    headStyles: {
      fillColor: GREEN_DARK,       // header bg
      textColor: 255,              // white text
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      textColor: [31, 41, 55],     // slate-700
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],  // subtle zebra
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 25, halign: 'left' },
      2: { cellWidth: 70 },
      3: { cellWidth: 40 },
    },
    margin: { left, right },
    tableWidth: pageWidth - left - right,
    theme: 'grid',
    didDrawPage: (data) => {
      // footer
      const page = doc.internal.getNumberOfPages();
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(
        `Page ${page}`,
        pageWidth - right,
        doc.internal.pageSize.getHeight() - 8,
        { align: 'right' }
      );

      // subtle top accent line in green (matches app)
      doc.setDrawColor(...GREEN);
      doc.setLineWidth(0.6);
      doc.line(left - 4, top - 6, pageWidth - right + 4, top - 6);
      doc.setLineWidth(0.2);
      doc.setDrawColor(...GREY_BORDER);
    },
  });

  doc.save('employees-report.pdf');

  // keep your notification
  const newNotif = {
    id: Date.now(),
    message: '📄 Employees report exported to PDF',
    time: new Date().toLocaleTimeString(),
  };
  const existing = JSON.parse(localStorage.getItem('notifications') || '[]');
  localStorage.setItem('notifications', JSON.stringify([newNotif, ...existing].slice(0, 15)));
};





const exportToCSV = () => {
  // CSV helpers
  const DELIM = ',';                 // delimiter
  const EOL = '\r\n';                // Windows-friendly newlines for Excel
  const csvEscape = (val) => {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""'); // escape quotes
    return `"${s}"`;                           // wrap every field in quotes
  };

  // rows to export (title row, blank row, header, body)
  const rows = [
    [`Employees Report${periodLabel()}`],
    [],
    ['Name', 'Role', 'Email', 'Last Login'],
    ...filteredEmployees.map((e) => [
      e.name || '',
      e.role || '',
      e.email || '',
      // keep your nice format even though it has a comma — we're quoting it now
      formatDate(e.last_login),
    ]),
  ];

  // Build CSV string with BOM so Excel detects UTF-8
  const csvString =
    '\uFEFF' +
    rows
      .map((r) => r.map(csvEscape).join(DELIM))
      .join(EOL);

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'employees-report.csv';
  a.click();

  // notification
  const newNotif = {
    id: Date.now(),
    message: '📊 Employees report exported to CSV',
    time: new Date().toLocaleTimeString(),
  };
  const existing = JSON.parse(localStorage.getItem('notifications') || '[]');
  localStorage.setItem('notifications', JSON.stringify([newNotif, ...existing].slice(0, 15)));
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
                Reports
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="Back to Dashboard" arrow>
                <IconButton
                  color="inherit"
                  onClick={handleBack}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.12)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'scale(1.1)',
                    },
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
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
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
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'scale(1.1)',
                    },
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

        {/* BODY */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
          {/* Enhanced Export Options */}
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
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1a7a35 0%, #2d9f47 100%)',
                    },
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
                    },
                  }}
                >
                  Export to CSV
                </ExportButton>
              </Stack>
            </GlassCard>
          </Fade>

          {/* Enhanced Search & Filter Controls */}
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
  {/* Search */}
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

  {/* Role */}
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

  {/* Period (like Dashboard) */}
  <TextField
    select
    label="Period"
    value={filterPeriod}
    onChange={(e) => setFilterPeriod(e.target.value)}
    size="small"
    SelectProps={{ native: true }}
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

  {/* Only when custom */}
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

  <Button
    variant="outlined"
    color="success"
    onClick={() => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const monday = new Date(now);
      monday.setDate(now.getDate() - diff);
      setFilterPeriod('week');
      setFilterStartDate(monday.toISOString().split('T')[0]);
      setFilterEndDate(now.toISOString().split('T')[0]);
    }}
    sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none', px: 2.5, py: 1 }}
  >
    Reset to This Week
  </Button>
</Box>


          </Fade>

          {/* Enhanced Table */}
          <Fade in timeout={1000}>
            <GlassCard sx={{ overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)' }}>
                      {['Name', 'Role', 'Email', 'Last Login'].map((h) => (
                        <TableCell
                          key={h}
                          sx={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', py: 3 }}
                        >
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
                bgcolor: emp.role === 'admin'
                  ? 'rgba(45, 159, 71, 0.15)'
                  : 'rgba(25, 118, 210, 0.15)',
                color: emp.role === 'admin' ? '#1a7a35' : '#1565c0',
                border: `1px solid ${
                  emp.role === 'admin' ? 'rgba(45, 159, 71, 0.3)' : 'rgba(25, 118, 210, 0.3)'
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