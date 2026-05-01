import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Palette, User, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const ToggleSwitch = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-indigo-600' : 'bg-white/10'}`}>
    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
  </button>
);

const Section = ({ title, icon: Icon, children, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="glass-card p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
        <Icon size={18} className="text-indigo-400" />
      </div>
      <h2 className="section-title">{title}</h2>
    </div>
    {children}
  </motion.div>
);

export default function SettingsPage() {
  const [notif, setNotif] = useState({ taskAssigned: true, taskUpdated: true, comments: true, deadlines: true, projectUpdates: false });
  const [security, setSecurity] = useState({ twoFactor: false, sessionTimeout: true });

  const handleSave = () => toast.success('Settings saved!');

  return (
    <div className="space-y-5 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your preferences and account settings</p>
      </motion.div>

      <Section title="Appearance" icon={Palette} delay={0.05}>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-white text-sm font-medium">Dark Mode</p>
              <p className="text-slate-500 text-xs mt-0.5">Always on — looks premium ✨</p>
            </div>
            <ToggleSwitch checked={true} onChange={() => {}} />
          </div>
          <div className="border-t border-white/5" />
          <div>
            <p className="text-white text-sm font-medium mb-3">Accent Color</p>
            <div className="flex gap-3">
              {['#6366F1', '#8B5CF6', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444'].map(c => (
                <button key={c} className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ background: c }}>
                  {c === '#6366F1' && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Notifications" icon={Bell} delay={0.1}>
        <div className="space-y-4">
          {[
            { key: 'taskAssigned', label: 'Task Assigned', desc: 'When a task is assigned to you' },
            { key: 'taskUpdated', label: 'Task Updated', desc: 'When a task you own is modified' },
            { key: 'comments', label: 'New Comments', desc: 'When someone comments on your task' },
            { key: 'deadlines', label: 'Deadline Reminders', desc: 'Alerts before tasks are due' },
            { key: 'projectUpdates', label: 'Project Updates', desc: 'When projects you\'re in are updated' },
          ].map(({ key, label, desc }, i) => (
            <div key={key}>
              {i > 0 && <div className="border-t border-white/5 mb-4" />}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                </div>
                <ToggleSwitch checked={notif[key]} onChange={v => setNotif({ ...notif, [key]: v })} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Security" icon={Shield} delay={0.15}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-slate-500 text-xs mt-0.5">Add an extra layer of security</p>
            </div>
            <ToggleSwitch checked={security.twoFactor} onChange={v => setSecurity({ ...security, twoFactor: v })} />
          </div>
          <div className="border-t border-white/5" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Session Timeout</p>
              <p className="text-slate-500 text-xs mt-0.5">Auto logout after 7 days of inactivity</p>
            </div>
            <ToggleSwitch checked={security.sessionTimeout} onChange={v => setSecurity({ ...security, sessionTimeout: v })} />
          </div>
        </div>
      </Section>

      <Section title="Account" icon={User} delay={0.2}>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
            <p className="text-red-400 font-medium text-sm mb-1">Danger Zone</p>
            <p className="text-slate-500 text-xs mb-3">Irreversible actions. Please be careful.</p>
            <button className="btn-danger text-sm py-2">Delete Account</button>
          </div>
        </div>
      </Section>

      <button onClick={handleSave} className="btn-primary">
        <Check size={16} /> Save All Settings
      </button>
    </div>
  );
}
