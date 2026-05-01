import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';
import toast from 'react-hot-toast';

// Load persisted user
const savedUser = JSON.parse(localStorage.getItem('WorkVerse_user') || 'null');
const savedToken = localStorage.getItem('WorkVerse_token') || null;

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/auth/login', credentials);
    localStorage.setItem('WorkVerse_token', data.token);
    localStorage.setItem('WorkVerse_user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/auth/register', userData);
    localStorage.setItem('WorkVerse_token', data.token);
    localStorage.setItem('WorkVerse_user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await API.put('/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    localStorage.setItem('WorkVerse_user', JSON.stringify(data.user));
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,
    token: savedToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('WorkVerse_token');
      localStorage.removeItem('WorkVerse_user');
      toast.success('Logged out successfully');
    },
    clearError: (state) => { state.error = null; },
    setUser: (state, action) => { state.user = action.payload; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateProfile.fulfilled, (state, action) => { state.user = action.payload; });
  }
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
