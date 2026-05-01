const Task = require('../models/Task');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

const createNotification = async (userId, type, message, fromUser, link = '') => {
  try {
    const notif = await Notification.create({ userId, type, message, fromUser, link });
    return notif;
  } catch (e) { return null; }
};

// @desc    Create task
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    await task.populate([
      { path: 'assignedTo', select: 'name avatar email' },
      { path: 'projectId', select: 'title' },
      { path: 'createdBy', select: 'name avatar' }
    ]);

    // Send notification to assigned user
    if (task.assignedTo && task.assignedTo._id.toString() !== req.user._id.toString()) {
      await createNotification(
        task.assignedTo._id, 'task_assigned',
        `${req.user.name} assigned you a task: "${task.title}"`,
        req.user._id, `/tasks/${task._id}`
      );
      // Emit socket event
      if (req.io) {
        req.io.to(task.assignedTo._id.toString()).emit('notification', { type: 'task_assigned', message: `New task assigned: ${task.title}` });
      }
    }
    await ActivityLog.create({ user: req.user._id, action: `Created task "${task.title}"`, entity: 'task', entityId: task._id });
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tasks
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const { projectId, status, priority, assignedTo } = req.query;
    let query = {};
    if (projectId) query.projectId = projectId;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (req.user.role !== 'admin' && !projectId) {
      query.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name avatar email')
      .populate('projectId', 'title color')
      .populate('createdBy', 'name avatar')
      .sort('order -createdAt');

    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name avatar email')
      .populate('projectId', 'title color')
      .populate('createdBy', 'name avatar')
      .populate('comments.user', 'name avatar');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const oldTask = await Task.findById(req.params.id);
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('assignedTo', 'name avatar email')
      .populate('projectId', 'title color')
      .populate('createdBy', 'name avatar');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    // Notify on assignment change
    if (req.body.assignedTo && oldTask.assignedTo?.toString() !== req.body.assignedTo) {
      await createNotification(req.body.assignedTo, 'task_assigned', `${req.user.name} assigned you a task: "${task.title}"`, req.user._id);
      if (req.io) req.io.to(req.body.assignedTo).emit('notification', { type: 'task_assigned', message: `Task assigned: ${task.title}` });
    }

    // Notify on status change
    if (req.body.status && oldTask.status !== req.body.status && task.assignedTo) {
      await createNotification(task.assignedTo._id, 'task_updated', `Task "${task.title}" status changed to ${req.body.status}`, req.user._id);
    }

    await ActivityLog.create({ user: req.user._id, action: `Updated task "${task.title}"`, entity: 'task', entityId: task._id });
    if (req.io) req.io.emit('taskUpdated', task);

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment
// @route   POST /api/tasks/:id/comments
exports.addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.comments.push({ user: req.user._id, text: req.body.text });
    await task.save();
    await task.populate('comments.user', 'name avatar');
    if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
      await createNotification(task.assignedTo, 'comment_added', `${req.user.name} commented on "${task.title}"`, req.user._id);
    }
    if (req.io) req.io.emit('commentAdded', { taskId: task._id, comment: task.comments[task.comments.length - 1] });
    res.json({ success: true, comments: task.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update subtask
// @route   PUT /api/tasks/:id/subtasks/:subtaskId
exports.updateSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) return res.status(404).json({ success: false, message: 'Subtask not found' });
    subtask.completed = req.body.completed;
    await task.save();
    res.json({ success: true, subtasks: task.subtasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
