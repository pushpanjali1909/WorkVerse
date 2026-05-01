import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/tasks', { params });
    return data.tasks;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/tasks', taskData);
    toast.success('Task created!');
    return data.task;
  } catch (err) { toast.error(err.response?.data?.message || 'Failed'); return rejectWithValue(err.response?.data?.message); }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data: tData }, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/tasks/${id}`, tData);
    toast.success('Task updated!');
    return data.task;
  } catch (err) { toast.error(err.response?.data?.message || 'Failed'); return rejectWithValue(err.response?.data?.message); }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/tasks/${id}`);
    toast.success('Task deleted');
    return id;
  } catch (err) { toast.error(err.response?.data?.message || 'Failed'); return rejectWithValue(err.response?.data?.message); }
});

export const addComment = createAsyncThunk('tasks/addComment', async ({ id, text }, { rejectWithValue }) => {
  try {
    const { data } = await API.post(`/tasks/${id}/comments`, { text });
    return { id, comments: data.comments };
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { list: [], loading: false, error: null },
  reducers: {
    updateTaskLocally: (state, action) => {
      const idx = state.list.findIndex(t => t._id === action.payload._id);
      if (idx !== -1) state.list[idx] = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createTask.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.list.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => { state.list = state.list.filter(t => t._id !== action.payload); })
      .addCase(addComment.fulfilled, (state, action) => {
        const task = state.list.find(t => t._id === action.payload.id);
        if (task) task.comments = action.payload.comments;
      });
  }
});

export const { updateTaskLocally } = taskSlice.actions;
export default taskSlice.reducer;
