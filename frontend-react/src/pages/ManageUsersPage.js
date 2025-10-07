// src/pages/ManageUsersPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
} from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
}));

export default function ManageUsersPage() {
  const [roleFilter, setRoleFilter] = useState('employee');  // default
  const [userList, setUserList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loadingList, setLoadingList] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // When roleFilter changes, fetch user list
  useEffect(() => {
    setLoadingList(true);
    setError('');
    axios
      .get(`/users?role=${roleFilter}`)  // e.g. backend supports filtering by role
      .then((res) => {
        setUserList(res.data);
        setLoadingList(false);
      })
      .catch((err) => {
        console.error('Failed to load user list:', err);
        setError('Failed to load users');
        setLoadingList(false);
      });
  }, [roleFilter]);

  // When selectedUserId changes, fetch that user's data
  useEffect(() => {
    if (!selectedUserId) {
      setForm({ name: '', email: '', password: '' });
      return;
    }
    setLoadingUser(true);
    setError('');
    axios
      .get(`/users/${selectedUserId}`)
      .then((res) => {
        setForm({
          name: res.data.name || '',
          email: res.data.email || '',
          password: '',  // leave blank
        });
        setLoadingUser(false);
      })
      .catch((err) => {
        console.error('Failed to load user data:', err);
        setError('Failed to load user info');
        setLoadingUser(false);
      });
  }, [selectedUserId]);

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    setSelectedUserId('');  // reset selection
  };

  const handleUserSelect = (e) => {
    setSelectedUserId(e.target.value);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(`/users/${selectedUserId}`, form);
      alert('User updated successfully');
      // Optionally refetch list or user
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <StyledPaper>
        <Typography variant="h5" gutterBottom>
          Manage Users
        </Typography>

        {/* Role selector */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select value={roleFilter} onChange={handleRoleChange} label="Role">
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </Select>
        </FormControl>

        {loadingList ? (
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <FormControl fullWidth margin="normal">
            <InputLabel>Select User</InputLabel>
            <Select
              value={selectedUserId}
              onChange={handleUserSelect}
              label="Select User"
            >
              <MenuItem value="">-- Select --</MenuItem>
              {userList.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {selectedUserId && (
          <Box component="form" onSubmit={handleSave} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleFormChange}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleFormChange}
              fullWidth
              helperText="Leave blank to keep existing password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              type="submit"
            >
              Save Changes
            </Button>
          </Box>
        )}
      </StyledPaper>
    </Container>
  );
}
