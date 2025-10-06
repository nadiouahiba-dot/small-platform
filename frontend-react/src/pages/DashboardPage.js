// src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
} from '@mui/material';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found. Please login.');
      return;
    }

    axios
      .get('http://localhost:5000/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard. Please login again.');
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Go to Login
        </Button>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {data.role === 'admin' ? (
          <>
            <Typography variant="h4" gutterBottom>
              Admin Dashboard
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
              Total Employees: {data.totalEmployees}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Recent Logins
            </Typography>
            <List>
              {data.recentLogins.map((user, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={user.name}
                    secondary={`Last Login: ${
                      user.last_login || 'Never logged in'
                    }`}
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/reports')}
                color="primary"
              >
                Go to Reports
              </Button>

              <Button
                variant="outlined"
                onClick={handleLogout}
                color="error"
              >
                Logout
              </Button>
            </Box>
          </>
        ) : data.role === 'employee' ? (
          <>
            <Typography variant="h4" gutterBottom>
              Employee Dashboard
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Name:</strong> {data.user.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {data.user.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              <strong>Role:</strong> {data.user.role}
            </Typography>

            <Button
              variant="outlined"
              onClick={handleLogout}
              color="error"
            >
              Logout
            </Button>
          </>
        ) : (
          <Typography>Unknown role</Typography>
        )}
      </Paper>
    </Container>
  );
}
