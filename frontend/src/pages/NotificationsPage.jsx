// NotificationsPage.jsx
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, BellOff } from 'lucide-react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../redux/slices/notificationSlice';
import { useEffect } from 'react';

const typeColors = {
  task_assigned: '#6366F1', task_updated: '#06B6D4', comment_added: '#F59E0B',
  deadline_reminder: '#EF4444', project_update: '#22C55E'
};

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { list, unreadCount } = useSelector(s => s.notifications);

  useEffect(() => { dispatch(fetchNotifications()); }, []);

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={() => dispatch(markAllNotificationsRead())} className="btn-secondary text-sm py-2">
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="glass-card p-14 text-center">
          <BellOff size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((notif, i) => (
            <motion.div key={notif._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => !notif.read && dispatch(markNotificationRead(notif._id))}
              className={`glass-card p-4 flex items-start gap-4 cursor-pointer transition-all hover:border-indigo-500/20 ${!notif.read ? 'border-indigo-500/20 bg-indigo-500/5' : ''}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${typeColors[notif.type]}18` }}>
                <Bell size={16} style={{ color: typeColors[notif.type] }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${!notif.read ? 'text-white' : 'text-slate-400'}`}>{notif.message}</p>
                <p className="text-slate-600 text-xs mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
              </div>
              {!notif.read && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
