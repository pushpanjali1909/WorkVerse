import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderKanban, CheckSquare, Clock, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { fetchDashboardStats } from '../redux/slices/projectSlice';
import { fetchTasks } from '../redux/slices/taskSlice';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const weeklyData = [
  { day: 'Mon', tasks: 4 }, { day: 'Tue', tasks: 7 }, { day: 'Wed', tasks: 5 },
  { day: 'Thu', tasks: 9 }, { day: 'Fri', tasks: 6 }, { day: 'Sat', tasks: 3 }, { day: 'Sun', tasks: 8 },
];

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="stat-card"
    style={{ '--glow': color }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold text-white">{value ?? '—'}</div>
      </div>
    </div>
    <p className="text-slate-400 text-sm font-medium">{label}</p>
    <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full opacity-[0.04]"
      style={{ background: color, transform: 'translate(30%, 30%)' }} />
  </motion.div>
);

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { stats, recentActivity, loading } = useSelector(s => s.projects);
  const { list: tasks } = useSelector(s => s.tasks);
  const { user } = useSelector(s => s.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchTasks());
  }, []);

  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const isOverdue = (date) => date && new Date(date) < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">Here's what's happening with your workspace today.</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderKanban} label="Total Projects" value={stats?.totalProjects} color="#6366F1" delay={0.05} />
        <StatCard icon={CheckSquare} label="Completed Tasks" value={stats?.completedTasks} color="#22C55E" delay={0.1} />
        <StatCard icon={Clock} label="In Progress" value={stats?.inProgressTasks} color="#06B6D4" delay={0.15} />
        <StatCard icon={AlertTriangle} label="Overdue" value={stats?.overdueTasks} color="#EF4444" delay={0.2} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Weekly chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-card p-5 lg:col-span-3">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} className="text-indigo-400" />
            <h2 className="section-title">Weekly Task Completion</h2>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
              <Area type="monotone" dataKey="tasks" stroke="#6366F1" strokeWidth={2} fill="url(#taskGrad)" dot={{ fill: '#6366F1', strokeWidth: 0, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Task distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-5 lg:col-span-2">
          <h2 className="section-title mb-5">Task Status</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={[
              { name: 'Todo', value: tasks.filter(t => t.status === 'todo').length, fill: '#64748B' },
              { name: 'Progress', value: tasks.filter(t => t.status === 'in-progress').length, fill: '#06B6D4' },
              { name: 'Review', value: tasks.filter(t => t.status === 'review').length, fill: '#F59E0B' },
              { name: 'Done', value: tasks.filter(t => t.status === 'completed').length, fill: '#22C55E' },
            ]} barSize={28}>
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {[{ fill: '#64748B' }, { fill: '#06B6D4' }, { fill: '#F59E0B' }, { fill: '#22C55E' }].map((entry, index) => (
                  <rect key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming tasks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Upcoming Deadlines</h2>
            <Link to="/tasks" className="text-indigo-400 text-xs hover:text-indigo-300">View all</Link>
          </div>
          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No upcoming deadlines 🎉</p>
            ) : upcomingTasks.map(task => (
              <div key={task._id} className="flex items-center gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-all">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isOverdue(task.dueDate) ? 'bg-red-500' : 'bg-indigo-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{task.title}</p>
                  <p className="text-slate-500 text-xs">{task.projectId?.title}</p>
                </div>
                <div className={`text-xs font-medium flex-shrink-0 ${isOverdue(task.dueDate) ? 'text-red-400' : 'text-slate-400'}`}>
                  {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-purple-400" />
            <h2 className="section-title">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {recentActivity?.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No activity yet</p>
            ) : recentActivity?.slice(0, 6).map((log, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  {log.user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs leading-relaxed">{log.action}</p>
                  <p className="text-slate-600 text-xs mt-0.5">
                    {new Date(log.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
