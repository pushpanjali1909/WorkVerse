import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Trash2, Edit, CheckCircle, X, MessageSquare } from 'lucide-react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../redux/slices/taskSlice';
import { fetchProjects } from '../redux/slices/projectSlice';
import API from '../api/axios';

const TaskModal = ({ task, onClose, onSave, projects, users }) => {
  const { user } = useSelector(s => s.auth);
  const [form, setForm] = useState(task || {
    title: '', description: '', projectId: '', assignedTo: '',
    priority: 'medium', status: 'todo', dueDate: '', labels: [], subtasks: []
  });
  const [newSubtask, setNewSubtask] = useState('');

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ background: 'rgba(15,23,42,0.98)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Task Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="input-field" placeholder="What needs to be done?" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="input-field resize-none" rows={2} placeholder="Add details..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Project *</label>
              <select value={form.projectId?._id || form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })}
                className="input-field appearance-none" required>
                <option value="" className="bg-[#0F172A]">Select project</option>
                {projects.map(p => <option key={p._id} value={p._id} className="bg-[#0F172A]">{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Assign To</label>
              <select value={form.assignedTo?._id || form.assignedTo || ''} onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                className="input-field appearance-none">
                <option value="" className="bg-[#0F172A]">Unassigned</option>
                {users.map(u => <option key={u._id} value={u._id} className="bg-[#0F172A]">{u.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                className="input-field appearance-none">
                <option value="low" className="bg-[#0F172A]">Low</option>
                <option value="medium" className="bg-[#0F172A]">Medium</option>
                <option value="high" className="bg-[#0F172A]">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                className="input-field appearance-none">
                <option value="todo" className="bg-[#0F172A]">Todo</option>
                <option value="in-progress" className="bg-[#0F172A]">In Progress</option>
                <option value="review" className="bg-[#0F172A]">Review</option>
                <option value="completed" className="bg-[#0F172A]">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Due Date</label>
            <input type="date" value={form.dueDate ? form.dueDate.split('T')[0] : ''}
              onChange={e => setForm({ ...form, dueDate: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Subtasks</label>
            <div className="space-y-2 mb-2">
              {form.subtasks?.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="checkbox" checked={s.completed} onChange={e => {
                    const sub = [...form.subtasks]; sub[i] = { ...sub[i], completed: e.target.checked };
                    setForm({ ...form, subtasks: sub });
                  }} className="accent-indigo-500" />
                  <span className={`text-sm flex-1 ${s.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{s.title}</span>
                  <button type="button" onClick={() => setForm({ ...form, subtasks: form.subtasks.filter((_, j) => j !== i) })}
                    className="text-slate-600 hover:text-red-400"><X size={12} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newSubtask} onChange={e => setNewSubtask(e.target.value)} onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); if (newSubtask.trim()) { setForm({ ...form, subtasks: [...(form.subtasks || []), { title: newSubtask.trim(), completed: false }] }); setNewSubtask(''); } }
              }}
                className="input-field text-sm py-1.5" placeholder="Add subtask (press Enter)" />
              <button type="button" onClick={() => { if (newSubtask.trim()) { setForm({ ...form, subtasks: [...(form.subtasks || []), { title: newSubtask.trim(), completed: false }] }); setNewSubtask(''); } }}
                className="btn-secondary py-1.5 px-3 text-sm">Add</button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">{task ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default function TasksPage() {
  const dispatch = useDispatch();
  const { list: tasks, loading } = useSelector(s => s.tasks);
  const { list: projects } = useSelector(s => s.projects);
  const { user } = useSelector(s => s.auth);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
    API.get('/auth/users').then(r => setUsers(r.data.users || [])).catch(() => {});
  }, []);

  const handleSave = async (form) => {
    if (modal?.edit) await dispatch(updateTask({ id: modal.edit._id, data: form }));
    else await dispatch(createTask(form));
    setModal(null);
  };

  const handleStatusChange = (task, status) => {
    dispatch(updateTask({ id: task._id, data: { status } }));
  };

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filter.status || t.status === filter.status;
    const matchPriority = !filter.priority || t.priority === filter.priority;
    return matchSearch && matchStatus && matchPriority;
  });

  const isOverdue = t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed';

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} tasks</p>
        </div>
        <button onClick={() => setModal({ open: true })} className="btn-primary flex-shrink-0">
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search size={14} className="text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks..." className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full" />
        </div>
        <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}
          className="input-field w-auto appearance-none text-sm py-2">
          <option value="" className="bg-[#0F172A]">All Status</option>
          <option value="todo" className="bg-[#0F172A]">Todo</option>
          <option value="in-progress" className="bg-[#0F172A]">In Progress</option>
          <option value="review" className="bg-[#0F172A]">Review</option>
          <option value="completed" className="bg-[#0F172A]">Completed</option>
        </select>
        <select value={filter.priority} onChange={e => setFilter({ ...filter, priority: e.target.value })}
          className="input-field w-auto appearance-none text-sm py-2">
          <option value="" className="bg-[#0F172A]">All Priority</option>
          <option value="low" className="bg-[#0F172A]">Low</option>
          <option value="medium" className="bg-[#0F172A]">Medium</option>
          <option value="high" className="bg-[#0F172A]">High</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-14 text-center">
          <CheckCircle size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No tasks found</p>
          <button onClick={() => setModal({ open: true })} className="btn-primary mt-4"><Plus size={15} />Create Task</button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((task, i) => (
            <motion.div key={task._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`glass-card p-4 flex items-center gap-4 group hover:border-indigo-500/20 transition-all ${isOverdue(task) ? 'border-red-500/20' : ''}`}>
              <button onClick={() => handleStatusChange(task, task.status === 'completed' ? 'todo' : 'completed')}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-slate-500 hover:border-indigo-400'}`}>
                {task.status === 'completed' && <CheckCircle size={12} className="text-white" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>{task.title}</span>
                  {isOverdue(task) && <span className="badge bg-red-500/15 text-red-400 border-red-500/25">overdue</span>}
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {task.projectId && <span className="text-slate-500 text-xs">{task.projectId.title}</span>}
                  {task.dueDate && <span className="text-slate-500 text-xs">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                  {task.comments?.length > 0 && (
                    <span className="flex items-center gap-1 text-slate-500 text-xs"><MessageSquare size={11} />{task.comments.length}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`priority-${task.priority} hidden sm:inline-flex`}>{task.priority}</span>
                <span className={`status-${task.status} hidden md:inline-flex`}>{task.status.replace('-', ' ')}</span>
                {task.assignedTo && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold" title={task.assignedTo.name}>
                    {task.assignedTo.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModal({ open: true, edit: task })}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"><Edit size={14} /></button>
                  {user?.role === 'admin' && (
                    <button onClick={() => { if (confirm('Delete task?')) dispatch(deleteTask(task._id)); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal?.open && (
          <TaskModal task={modal.edit} onClose={() => setModal(null)} onSave={handleSave}
            projects={projects} users={users} />
        )}
      </AnimatePresence>
    </div>
  );
}
