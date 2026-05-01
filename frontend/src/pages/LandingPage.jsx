import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, CheckCircle, Users, BarChart3, ArrowRight, Star, Kanban, Bell, Shield } from 'lucide-react';

const features = [
  { icon: Kanban, title: 'Kanban Board', desc: 'Drag & drop tasks across customizable columns. Visualize your workflow instantly.', color: '#6366F1' },
  { icon: Users, title: 'Team Collaboration', desc: 'Assign tasks, mention teammates, comment in real-time. Everyone stays aligned.', color: '#8B5CF6' },
  { icon: BarChart3, title: 'Analytics & Reports', desc: 'Track productivity, measure performance, and surface insights that matter.', color: '#06B6D4' },
  { icon: Bell, title: 'Smart Notifications', desc: 'Real-time alerts for task updates, deadlines, and comments via Socket.IO.', color: '#22C55E' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Admin and member roles keep your workspace secure and organized.', color: '#F59E0B' },
  { icon: CheckCircle, title: 'Task Management', desc: 'Subtasks, labels, priorities, due dates — everything you need in one place.', color: '#EF4444' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Product Manager', text: 'WorkVerse completely transformed how our team manages sprints. The kanban view is chef\'s kiss.', rating: 5 },
  { name: 'Arjun Mehta', role: 'Engineering Lead', text: 'Finally a task manager that doesn\'t feel like a chore. Clean UI and real-time updates are 🔥', rating: 5 },
  { name: 'Neha Gupta', role: 'Startup Founder', text: 'We replaced Jira with WorkVerse and never looked back. Setup took 10 minutes.', rating: 5 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-hidden">
      {/* BG effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6366F1, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">WorkVerse</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary text-sm">Login</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-20 pb-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-8">
            <Zap size={14} /> Now with real-time collaboration
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Manage Teams &<br />
            <span style={{ background: 'linear-gradient(135deg, #6366F1, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Tasks Smarter
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Boost productivity with real-time collaboration, smart task management, and powerful analytics. The team workspace built for how modern teams actually work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-8 py-3">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3">
              Live Demo
            </Link>
          </div>
          <p className="text-slate-500 text-sm mt-5">No credit card required · Free forever for small teams</p>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="glass-card p-1 overflow-hidden" style={{ boxShadow: '0 0 80px rgba(99,102,241,0.2)' }}>
            <div className="bg-[#0F172A] rounded-xl p-6 text-left">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-slate-500 text-sm">WorkVerse Dashboard</span>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[['12', 'Projects', '#6366F1'], ['48', 'Tasks', '#8B5CF6'], ['31', 'Completed', '#22C55E'], ['5', 'Overdue', '#EF4444']].map(([num, label, color]) => (
                  <div key={label} className="glass-card p-3 text-center">
                    <div className="text-2xl font-bold" style={{ color }}>{num}</div>
                    <div className="text-slate-400 text-xs mt-1">{label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['Design System', 'API Integration', 'User Testing'].map((t, i) => (
                  <div key={t} className="glass-card p-3">
                    <div className="text-sm font-medium text-white mb-2">{t}</div>
                    <div className="progress-bar mb-2"><div className="progress-fill" style={{ width: `${[75, 45, 90][i]}%` }} /></div>
                    <div className="text-xs text-slate-400">{[75, 45, 90][i]}% complete</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white mb-4">Everything your team needs</h2>
            <p className="text-slate-400 text-lg">Powerful features designed for modern teams</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card-hover p-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                  style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 px-6 md:px-12 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white mb-4">Loved by teams worldwide</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map(({ name, role, text, rating }, i) => (
              <motion.div key={name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(rating)].map((_, j) => <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{text}"</p>
                <div>
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="text-slate-400 text-xs">{role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="max-w-2xl mx-auto glass-card p-12" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))' }}>
            <h2 className="text-4xl font-bold text-white mb-4">Ready to boost productivity?</h2>
            <p className="text-slate-400 mb-8">Join thousands of teams already using WorkVerse</p>
            <Link to="/register" className="btn-primary text-base px-10 py-3">
              Start for Free <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 border-t border-white/5 text-slate-500 text-sm">
        © 2025 WorkVerse. Built with ❤️ using MERN Stack.
      </footer>
    </div>
  );
}
