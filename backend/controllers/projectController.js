const Project = require('../models/Project');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

// @desc    Create project
// @route   POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, createdBy: req.user._id });
    await project.populate('createdBy', 'name avatar');
    await ActivityLog.create({ user: req.user._id, action: `Created project "${project.title}"`, entity: 'project', entityId: project._id });
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query = { $or: [{ createdBy: req.user._id }, { teamMembers: req.user._id }] };
    }
    const projects = await Project.find(query)
      .populate('createdBy', 'name avatar')
      .populate('teamMembers', 'name avatar email')
      .sort('-createdAt');

    // Add task stats per project
    const projectsWithStats = await Promise.all(projects.map(async (project) => {
      const tasks = await Task.find({ projectId: project._id });
      const completed = tasks.filter(t => t.status === 'completed').length;
      const total = tasks.length;
      return {
        ...project.toObject(),
        taskStats: { total, completed, progress: total ? Math.round((completed / total) * 100) : 0 }
      };
    }));

    res.json({ success: true, count: projects.length, projects: projectsWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name avatar')
      .populate('teamMembers', 'name avatar email role');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    const tasks = await Task.find({ projectId: project._id }).populate('assignedTo', 'name avatar');
    res.json({ success: true, project, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('createdBy', 'name avatar')
      .populate('teamMembers', 'name avatar email');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    await ActivityLog.create({ user: req.user._id, action: `Updated project "${project.title}"`, entity: 'project', entityId: project._id });
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    await Task.deleteMany({ projectId: project._id });
    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/projects/stats
exports.getDashboardStats = async (req, res) => {
  try {
    let projectQuery = req.user.role === 'admin' ? {} : { $or: [{ createdBy: req.user._id }, { teamMembers: req.user._id }] };
    let taskQuery = req.user.role === 'admin' ? {} : { $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }] };

    const [totalProjects, totalTasks, completedTasks, inProgressTasks, overdueTasks] = await Promise.all([
      Project.countDocuments(projectQuery),
      Task.countDocuments(taskQuery),
      Task.countDocuments({ ...taskQuery, status: 'completed' }),
      Task.countDocuments({ ...taskQuery, status: 'in-progress' }),
      Task.countDocuments({ ...taskQuery, dueDate: { $lt: new Date() }, status: { $ne: 'completed' } })
    ]);

    const recentActivity = await ActivityLog.find()
      .populate('user', 'name avatar')
      .sort('-createdAt').limit(10);

    res.json({
      success: true,
      stats: { totalProjects, totalTasks, completedTasks, inProgressTasks, overdueTasks, pendingTasks: totalTasks - completedTasks },
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
