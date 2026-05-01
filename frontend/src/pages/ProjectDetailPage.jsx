import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Calendar, Plus, CheckCircle, Clock } from 'lucide-react';
import { fetchProjectById } from '../redux/slices/projectSlice';
import { createTask, updateTask } from '../redux/slices/taskSlice';
import API from '../api/axios';
import toast from 'react-hot-toast';

const statusColors = { todo: '#64748B', 'in-progress': '#06B6D4', review: '#F59E0B', completed: '#22C55E' };
const priorityColors = { low: '#22C55E', medium: '#F59E0B', high: '#EF4444' };

export default function ProjectDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current } = useSelector(s => s.projects);
  const { user } = useSelector(s => s.auth);
  const [users, setUsers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', priority: 'medium', assignedTo: '', dueDate: '' });
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    dispatch(fetchProjectById(id));
    API.get('/auth/users').then(r => setUsers(r.data.users || [])).catch(() => {});
  }, [id]);

  const project = current?.project;
  const tasks = current?.tasks || [];

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const result = await dispatch(createTask({ ...taskForm, projectId: id }));
    if (!result.error) {
      setTaskForm({ title: '', priority: 'medium', assignedTo: '', dueDate: '' });
      setShowTaskForm(false);
      dispatch(fetchProjectById(id));
    }
  };

  const handleStatusChange = async (task, status) => {
    await dispatch(updateTask({ id: task._id, data: { status } }));
    dispatch(fetchProjectById(id));
  };

  if (!project) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const groupedTasks = { todo: [], 'in-progress': [], review: [], completed: [] };
  tasks.forEach(t => { if (groupedTasks[t.status]) groupedTasks[t.status].push(t); });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/projects" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        <div className="glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${project.color || '#6366F1'}20` }}>
                <div className="w-4 h-4 rounded" style={{ background: project.color || '#6366F1' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{project.title}</h1>
                {project.description && <p className="text-slate-400 text-sm mt-1 max-w-lg">{project.description}</p>}
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className={`priority-${project.priority}`}>{project.priority}</span>
                  <span className="badge" style={{ background: `${statusColors[project.status] || '#64748B'}18`, color: statusColors[project.status] || '#64748B', border: `1px solid ${statusColors[project.status] || '#64748B'}28` }}>
                    {project.status}
                  </span>
                  {project.deadline && (
                    <span className="flex items-center gap-1 text-slate-500 text-xs">
                      <Calendar size={12} />{new Date(project.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="flex items-center gap-2">
              <Users size={14} className="text-slate-500" />
              <div className="flex -space-x-2">
                {project.teamMembers?.map(m => (
                  <div key={m._id} className="w-8 h-8 rounded-full border-2 border-[#0F172A] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold" title={m.name}>
                    {m.name?.[0]?.toUpperCase()}
                  </div>
                ))}
              </div>
              <span className="text-slate-500 text-sm">{project.teamMembers?.length || 0} members</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">{completedCount}/{tasks.length} tasks completed</span>
              <span className="text-white font-semibold">{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Task Form */}
      {isAdmin && (
        <div>
          {!showTaskForm ? (
            <button onClick={() => setShowTaskForm(true)} className="btn-secondary">
              <Plus size={15} /> Add Task
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5">
              <h3 className="text-white font-semibold mb-4">New Task</h3>
              <form onSubmit={handleCreateTask} className="flex flex-wrap gap-3 items-end">
                <input value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="input-field flex-1 min-w-48" placeholder="Task title..." required />
                <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
                  className="input-field w-auto appearance-none">
                  <option value="low" className="bg-[#0F172A]">Low</option>
                  <option value="medium" className="bg-[#0F172A]">Medium</option>
                  <option value="high" className="bg-[#0F172A]">High</option>
                </select>
                <select value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  className="input-field w-auto appearance-none">
                  <option value="" className="bg-[#0F172A]">Unassigned</option>
                  {users.map(u => <option key={u._id} value={u._id} className="bg-[#0F172A]">{u.name}</option>)}
                </select>
                <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="input-field w-auto" />
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary py-2">Create</button>
                  <button type="button" onClick={() => setShowTaskForm(false)} className="btn-secondary py-2">Cancel</button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      )}

      {/* Task columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(groupedTasks).map(([status, colTasks]) => (
          <motion.div key={status} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: statusColors[status] }} />
              <h3 className="text-white font-semibold text-sm capitalize">{status.replace('-', ' ')}</h3>
              <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: `${statusColors[status]}20`, color: statusColors[status] }}>{colTasks.length}</span>
            </div>
            <div className="space-y-2 min-h-[100px] rounded-xl p-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.05)' }}>
              {colTasks.map(task => (
                <div key={task._id} className="glass-card p-3 group">
                  <div className="flex items-start gap-2 mb-2">
                    <button onClick={() => handleStatusChange(task, task.status === 'completed' ? 'todo' : 'completed')}
                      className={`w-4 h-4 rounded-full border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-slate-500 hover:border-green-400'}`}>
                      {task.status === 'completed' && <CheckCircle size={10} className="text-white" />}
                    </button>
                    <p className={`text-sm font-medium flex-1 ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>{task.title}</p>
                  </div>
                  <div className="flex items-center justify-between pl-6">
                    <span className={`priority-${task.priority}`}>{task.priority}</span>
                    <div className="flex items-center gap-2">
                      {task.dueDate && (
                        <span className={`flex items-center gap-1 text-xs ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-400' : 'text-slate-500'}`}>
                          <Clock size={10} />{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      {task.assignedTo && (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold" title={task.assignedTo.name}>
                          {task.assignedTo.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
