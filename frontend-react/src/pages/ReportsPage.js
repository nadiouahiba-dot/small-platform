// src/pages/ReportsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Container,
  Avatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  PictureAsPdf as PictureAsPdfIcon,
  GridOn as CsvIcon,
  ArrowBack as ArrowBackIcon,
  ExitToApp as LogoutIcon,
  Assessment as ReportsIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a3a52 0%, #2d5a3f 100%)',
  '& .MuiTableCell-root': {
    color: 'white',
    fontWeight: 700,
    fontSize: '0.95rem',
    padding: theme.spacing(2),
    borderBottom: 'none',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#f8faf9',
    transform: 'scale(1.01)',
    boxShadow: '0 2px 8px rgba(45, 159, 71, 0.1)',
  },
  '&:nth-of-type(odd)': {
    backgroundColor: '#fafbfc',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  fontSize: '0.95rem',
  borderBottom: '1px solid #e0e0e0',
}));

const ExportButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.2, 3),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

export default function ReportsPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/reports', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Employees Report', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Name', 'Role', 'Last Login']],
      body: employees.map((emp) => [
        emp.name,
        emp.role,
        emp.last_login || 'Never',
      ]),
    });
    doc.save('employees-report.pdf');
  };

  const exportToCSV = () => {
    const csvRows = [
      ['Name', 'Role', 'Last Login'],
      ...employees.map((emp) => [
        emp.name,
        emp.role,
        emp.last_login || 'Never',
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handlePrevious = () => {
    navigate(-1);
  };

  if (loading) {
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
            Loading reports...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: 4 }}>
      <Container maxWidth="lg">
        <StyledPaper elevation={0}>
          <HeaderBox>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <ReportsIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="700">
                      Employee Reports
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                      Comprehensive overview of all employees
                    </Typography>
                  </Box>
                </Box>

                <Stack direction="row" spacing={2}>
                  <ActionButton
                    variant="outlined"
                    onClick={handlePrevious}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Back
                  </ActionButton>

                  <ActionButton
                    variant="outlined"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      '&:hover': {
                        borderColor: '#ff6b6b',
                        bgcolor: 'rgba(255, 107, 107, 0.1)',
                      },
                    }}
                  >
                    Logout
                  </ActionButton>
                </Stack>
              </Box>
            </Box>
          </HeaderBox>

          <Box sx={{ p: 4 }}>
            {/* Export Buttons Section */}
            <Box sx={{ 
              mb: 3, 
              p: 3, 
              bgcolor: '#f8faf9', 
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Export Options
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
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
                    '&:hover': {
                      borderColor: '#1a7a35',
                      bgcolor: 'rgba(45, 159, 71, 0.04)',
                    },
                  }}
                >
                  Export to CSV
                </ExportButton>
              </Stack>
            </Box>

            {/* Statistics */}
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              bgcolor: 'white', 
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Avatar sx={{ bgcolor: '#2d9f47', width: 48, height: 48 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="700" color="#2d9f47">
                  {employees.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Employees
                </Typography>
              </Box>
            </Box>

            {/* Table */}
            <StyledTableContainer component={Paper}>
              <Table aria-label="employees table">
                <StyledTableHead>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 20 }} />
                        Name
                      </Box>
                    </TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon sx={{ fontSize: 20 }} />
                        Last Login
                      </Box>
                    </TableCell>
                  </TableRow>
                </StyledTableHead>

                <TableBody>
                  {employees.length === 0 ? (
                    <TableRow>
                      <StyledTableCell colSpan={3} align="center">
                        <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                          No employees found
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  ) : (
                    employees.map((emp, idx) => (
                      <StyledTableRow key={idx}>
                        <StyledTableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#2d9f47', width: 36, height: 36 }}>
                              {emp.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography fontWeight="500">{emp.name}</Typography>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Chip 
                            label={emp.role} 
                            size="small"
                            sx={{
                              bgcolor: emp.role === 'admin' ? '#1a3a52' : '#2d9f47',
                              color: 'white',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography variant="body2" color="text.secondary">
                            {emp.last_login || 'Never logged in'}
                          </Typography>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Box>
        </StyledPaper>
      </Container>
    </Box>
  );
}