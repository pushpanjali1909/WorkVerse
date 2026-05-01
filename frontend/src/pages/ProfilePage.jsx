import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Camera, User, Mail, FileText, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { updateProfile } from '../redux/slices/authSlice';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('bio', form.bio);
    if (avatarFile) fd.append('avatar', avatarFile);
    const result = await dispatch(updateProfile(fd));
    setSavingProfile(false);
    if (!result.error) toast.success('Profile updated!');
    else toast.error(result.payload || 'Update failed');
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirm) return toast.error('Passwords do not match');
    if (passForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setSavingPass(true);
    try {
      await API.put('/auth/change-password', { currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      toast.success('Password changed!');
      setPassForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
    setSavingPass(false);
  };

  const avatarSrc = avatarPreview || (user?.avatar ? `http://localhost:5000${user.avatar}` : null);

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your personal information</p>
      </motion.div>

      {/* Profile Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-6">
        <h2 className="section-title mb-6">Personal Information</h2>
        <form onSubmit={handleProfileSave} className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-2xl font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center cursor-pointer shadow-lg transition-colors">
                <Camera size={13} className="text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
            <div>
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-slate-400 text-sm capitalize">{user?.role}</p>
              <p className="text-slate-500 text-xs mt-1">Click the camera icon to change avatar</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-field pl-10" placeholder="Your name" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={user?.email} disabled className="input-field pl-10 opacity-50 cursor-not-allowed" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Bio</label>
            <div className="relative">
              <FileText size={15} className="absolute left-3 top-3 text-slate-500" />
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                className="input-field pl-10 resize-none" rows={3} placeholder="Tell your team about yourself..." maxLength={200} />
            </div>
            <p className="text-slate-600 text-xs mt-1 text-right">{form.bio.length}/200</p>
          </div>

          <button type="submit" disabled={savingProfile} className="btn-primary">
            {savingProfile ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
            Save Profile
          </button>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card p-6">
        <h2 className="section-title mb-6">Change Password</h2>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          {[
            { key: 'currentPassword', label: 'Current Password' },
            { key: 'newPassword', label: 'New Password' },
            { key: 'confirm', label: 'Confirm New Password' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type={showPass ? 'text' : 'password'} value={passForm[key]}
                  onChange={e => setPassForm({ ...passForm, [key]: e.target.value })}
                  className="input-field pl-10 pr-10" placeholder="••••••••" required />
                {key === 'confirm' && (
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="submit" disabled={savingPass} className="btn-primary">
            {savingPass ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock size={15} />}
            Change Password
          </button>
        </form>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card p-6">
        <h2 className="section-title mb-4">Account Info</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-white/3">
            <p className="text-slate-500 text-xs mb-1">Member Since</p>
            <p className="text-white font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '—'}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/3">
            <p className="text-slate-500 text-xs mb-1">Role</p>
            <p className="text-white font-medium capitalize">{user?.role}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
