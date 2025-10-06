// ... all imports remain unchanged
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CsvIcon from '@mui/icons-material/GridOn'; 
import { useNavigate } from 'react-router-dom';

export default function ReportsPage() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/reports', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error(err));
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

  return (
    <Box p={3}>
      {/* HEADER with buttons on the right */}
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        {/* You can add a logo or empty space on left if you want */}
        <Box />

        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="secondary" onClick={handlePrevious}>
            Previous
          </Button>

          <Button variant="outlined" color="error" onClick={handleLogout}>
            Log Out
          </Button>
        </Stack>
      </Box>

      <Typography variant="h4" gutterBottom>
        📋 Employees Report
      </Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PictureAsPdfIcon />}
          onClick={exportToPDF}
        >
          Export to PDF
        </Button>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<CsvIcon />}
          onClick={exportToCSV}
        >
          Export to CSV
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table aria-label="employees table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f2f2f2' }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Last Login</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees.map((emp, idx) => (
              <TableRow key={idx}>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.role}</TableCell>
                <TableCell>{emp.last_login || 'Never logged in'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
