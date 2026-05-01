import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../redux/slices/authSlice';

export default function Navbar({ onMenuClick }) {
  const { user } = useSelector(state => state.auth);
  const { unreadCount } = useSelector(state => state.notifications);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/5 flex-shrink-0"
      style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-slate-400 hover:text-white transition-colors">
          <Menu size={22} />
        </button>
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/8 rounded-lg px-3 py-2 w-64">
          <Search size={15} className="text-slate-500 flex-shrink-0" />
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search tasks, projects..."
            className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-all"
          >
            {user?.avatar ? (
              <img src={`http://localhost:5000${user.avatar}`} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="hidden md:block text-sm font-medium text-white">{user?.name?.split(' ')[0]}</span>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-52 glass-card py-2 z-50 shadow-2xl"
              >
                <div className="px-4 py-2 border-b border-white/5 mb-1">
                  <p className="text-white text-sm font-semibold">{user?.name}</p>
                  <p className="text-slate-400 text-xs">{user?.email}</p>
                </div>
                {[
                  { icon: User, label: 'Profile', path: '/profile' },
                  { icon: Settings, label: 'Settings', path: '/settings' },
                ].map(({ icon: Icon, label, path }) => (
                  <button key={path} onClick={() => { navigate(path); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                    <Icon size={15} />{label}
                  </button>
                ))}
                <div className="border-t border-white/5 mt-1 pt-1">
                  <button onClick={() => dispatch(logout())}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                    <LogOut size={15} />Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
