import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchTasks } from '../redux/slices/taskSlice';
import { fetchProjects } from '../redux/slices/projectSlice';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, LineChart, Line, Legend, CartesianGrid
} from 'recharts';

const RADIAN = Math.PI / 180;
const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>{`${(percent * 100).toFixed(0)}%`}</text>;
};

const tooltipStyle = { background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#fff', fontSize: 12 };

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const { list: tasks } = useSelector(s => s.tasks);
  const { list: projects } = useSelector(s => s.projects);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, []);

  // Status distribution
  const statusData = [
    { name: 'Todo', value: tasks.filter(t => t.status === 'todo').length, color: '#64748B' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#06B6D4' },
    { name: 'Review', value: tasks.filter(t => t.status === 'review').length, color: '#F59E0B' },
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#22C55E' },
  ].filter(d => d.value > 0);

  // Priority distribution
  const priorityData = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#22C55E' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#F59E0B' },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#EF4444' },
  ];

  // Tasks per project
  const projectData = projects.slice(0, 8).map(p => ({
    name: p.title.length > 12 ? p.title.substring(0, 12) + '…' : p.title,
    tasks: tasks.filter(t => (t.projectId?._id || t.projectId) === p._id).length,
    completed: tasks.filter(t => (t.projectId?._id || t.projectId) === p._id && t.status === 'completed').length,
  }));

  // Monthly task creation trend
  const monthlyData = monthNames.map((month, i) => ({
    month,
    created: tasks.filter(t => new Date(t.createdAt).getMonth() === i && new Date(t.createdAt).getFullYear() === new Date().getFullYear()).length,
    completed: tasks.filter(t => t.status === 'completed' && new Date(t.updatedAt).getMonth() === i).length,
  }));

  const completionRate = tasks.length ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Team performance and productivity insights</p>
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: tasks.length, color: '#6366F1' },
          { label: 'Completion Rate', value: `${completionRate}%`, color: '#22C55E' },
          { label: 'Active Projects', value: projects.filter(p => p.status === 'active').length, color: '#06B6D4' },
          { label: 'Overdue Tasks', value: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length, color: '#EF4444' },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-5 text-center relative overflow-hidden">
            <div className="text-3xl font-bold mb-1" style={{ color }}>{value}</div>
            <div className="text-slate-400 text-sm">{label}</div>
            <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full opacity-[0.04]" style={{ background: color, transform: 'translate(30%,30%)' }} />
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-5">
          <h2 className="section-title mb-5">Task Status Distribution</h2>
          {statusData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                  paddingAngle={3} dataKey="value" labelLine={false} label={CustomLabel}>
                  {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend formatter={(value) => <span style={{ color: '#94A3B8', fontSize: 12 }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-card p-5">
          <h2 className="section-title mb-5">Priority Breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priorityData} barSize={48}>
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-5">
          <h2 className="section-title mb-5">Tasks by Project</h2>
          {projectData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No projects yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={projectData} barSize={22}>
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend formatter={(v) => <span style={{ color: '#94A3B8', fontSize: 12 }}>{v}</span>} />
                <Bar dataKey="tasks" fill="#6366F1" radius={[4, 4, 0, 0]} name="Total" />
                <Bar dataKey="completed" fill="#22C55E" radius={[4, 4, 0, 0]} name="Done" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-card p-5">
          <h2 className="section-title mb-5">Monthly Activity</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend formatter={(v) => <span style={{ color: '#94A3B8', fontSize: 12 }}>{v}</span>} />
              <Line type="monotone" dataKey="created" stroke="#6366F1" strokeWidth={2} dot={{ fill: '#6366F1', r: 3 }} name="Created" />
              <Line type="monotone" dataKey="completed" stroke="#22C55E" strokeWidth={2} dot={{ fill: '#22C55E', r: 3 }} name="Completed" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
