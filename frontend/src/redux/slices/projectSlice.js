import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/projects');
    return data.projects;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchProjectById = createAsyncThunk('projects/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await API.get(`/projects/${id}`);
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createProject = createAsyncThunk('projects/create', async (projectData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/projects', projectData);
    toast.success('Project created!');
    return data.project;
  } catch (err) { toast.error(err.response?.data?.message || 'Failed'); return rejectWithValue(err.response?.data?.message); }
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, data: pData }, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/projects/${id}`, pData);
    toast.success('Project updated!');
    return data.project;
  } catch (err) { toast.error(err.response?.data?.message || 'Failed'); return rejectWithValue(err.response?.data?.message); }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/projects/${id}`);
    toast.success('Project deleted');
    return id;
  } catch (err) { toast.error(err.response?.data?.message || 'Failed'); return rejectWithValue(err.response?.data?.message); }
});

export const fetchDashboardStats = createAsyncThunk('projects/stats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/projects/stats');
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: { list: [], current: null, stats: null, recentActivity: [], loading: false, error: null },
  reducers: {
    clearCurrent: (state) => { state.current = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; })
      .addCase(fetchProjects.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchProjects.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchProjectById.fulfilled, (state, action) => { state.current = action.payload; })
      .addCase(createProject.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.list.findIndex(p => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.list = state.list.filter(p => p._id !== action.payload);
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
        state.recentActivity = action.payload.recentActivity;
      });
  }
});

export const { clearCurrent } = projectSlice.actions;
export default projectSlice.reducer;
