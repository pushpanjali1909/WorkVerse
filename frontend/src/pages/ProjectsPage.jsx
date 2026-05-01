import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderKanban, Users, Calendar, MoreHorizontal, Trash2, Edit, X } from 'lucide-react';
import { fetchProjects, createProject, updateProject, deleteProject } from '../redux/slices/projectSlice';
import API from '../api/axios';

const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444'];

const ProjectModal = ({ project, onClose, onSave }) => {
  const [form, setForm] = useState(project || { title: '', description: '', priority: 'medium', status: 'planning', deadline: '', color: '#6366F1', teamMembers: [] });
  const [users, setUsers] = useState([]);
  const { user } = useSelector(s => s.auth);

  useEffect(() => {
    if (user?.role === 'admin') API.get('/auth/users').then(r => setUsers(r.data.users)).catch(() => {});
  }, []);

  const handleSubmit = (e) => { e.preventDefault(); onSave(form); };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 w-full max-w-lg" style={{ background: 'rgba(15,23,42,0.98)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Project Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="input-field" placeholder="Enter project title" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="input-field resize-none" rows={3} placeholder="Brief project description" />
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
                <option value="planning" className="bg-[#0F172A]">Planning</option>
                <option value="active" className="bg-[#0F172A]">Active</option>
                <option value="completed" className="bg-[#0F172A]">Completed</option>
                <option value="on-hold" className="bg-[#0F172A]">On Hold</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Deadline</label>
            <input type="date" value={form.deadline ? form.deadline.split('T')[0] : ''}
              onChange={e => setForm({ ...form, deadline: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Color</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                  style={{ background: c, outline: form.color === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">
              {project ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const { list: projects, loading } = useSelector(s => s.projects);
  const { user } = useSelector(s => s.auth);
  const [modal, setModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const isAdmin = user?.role === 'admin';

  useEffect(() => { dispatch(fetchProjects()); }, []);

  const handleSave = async (form) => {
    if (modal?.edit) await dispatch(updateProject({ id: modal.edit._id, data: form }));
    else await dispatch(createProject(form));
    setModal(null);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this project and all its tasks?')) dispatch(deleteProject(id));
    setMenuOpen(null);
  };

  const statusColors = {
    planning: '#F59E0B', active: '#22C55E', completed: '#6366F1', 'on-hold': '#64748B'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="text-slate-400 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        {isAdmin && (
          <button onClick={() => setModal({ open: true })} className="btn-primary">
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <FolderKanban size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No projects yet</p>
          {isAdmin && <button onClick={() => setModal({ open: true })} className="btn-primary mt-4"><Plus size={16} />Create First Project</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div key={project._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card-hover p-5 relative overflow-hidden group">
              {/* Color accent */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: project.color || '#6366F1' }} />

              <div className="flex items-start justify-between mb-4 mt-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${project.color || '#6366F1'}18` }}>
                    <FolderKanban size={20} style={{ color: project.color || '#6366F1' }} />
                  </div>
                  <div>
                    <Link to={`/projects/${project._id}`}>
                      <h3 className="text-white font-semibold hover:text-indigo-400 transition-colors line-clamp-1">{project.title}</h3>
                    </Link>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColors[project.status] }} />
                      <span className="text-xs capitalize" style={{ color: statusColors[project.status] }}>{project.status}</span>
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === project._id ? null : project._id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal size={16} />
                    </button>
                    <AnimatePresence>
                      {menuOpen === project._id && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-8 w-36 glass-card py-1 z-10 shadow-xl">
                          <button onClick={() => { setModal({ open: true, edit: project }); setMenuOpen(null); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5">
                            <Edit size={13} /> Edit
                          </button>
                          <button onClick={() => handleDelete(project._id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10">
                            <Trash2 size={13} /> Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {project.description && <p className="text-slate-400 text-sm line-clamp-2 mb-4">{project.description}</p>}

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">{project.taskStats?.completed}/{project.taskStats?.total} tasks</span>
                  <span className="text-slate-400 font-medium">{project.taskStats?.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${project.taskStats?.progress || 0}%` }} />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.teamMembers?.slice(0, 4).map(m => (
                    <div key={m._id} className="w-7 h-7 rounded-full border-2 border-[#0F172A] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0" title={m.name}>
                      {m.avatar ? <img src={`http://localhost:5000${m.avatar}`} className="w-full h-full rounded-full object-cover" alt="" /> : m.name?.[0]?.toUpperCase()}
                    </div>
                  ))}
                  {project.teamMembers?.length > 4 && <div className="w-7 h-7 rounded-full border-2 border-[#0F172A] bg-slate-700 flex items-center justify-center text-xs text-slate-300">+{project.teamMembers.length - 4}</div>}
                </div>
                {project.deadline && (
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <Calendar size={11} />
                    <span>{new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
              </div>

              {/* Priority badge */}
              <div className="absolute top-4 right-4">
                <span className={`priority-${project.priority}`}>{project.priority}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal?.open && (
          <ProjectModal project={modal.edit} onClose={() => setModal(null)} onSave={handleSave} />
        )}
      </AnimatePresence>
    </div>
  );
}
