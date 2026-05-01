import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/notifications');
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const markNotificationRead = createAsyncThunk('notifications/markRead', async (id, { rejectWithValue }) => {
  try {
    await API.put(`/notifications/${id}`);
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const markAllNotificationsRead = createAsyncThunk('notifications/markAllRead', async (_, { rejectWithValue }) => {
  try {
    await API.put('/notifications/read-all');
    return true;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { list: [], unreadCount: 0, loading: false },
  reducers: {
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
      state.unreadCount += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.list = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const n = state.list.find(n => n._id === action.payload);
        if (n && !n.read) { n.read = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.list.forEach(n => n.read = true);
        state.unreadCount = 0;
      });
  }
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
