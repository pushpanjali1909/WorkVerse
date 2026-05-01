const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTask, updateTask, deleteTask, addComment, updateSubtask } = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `attachment-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Inject io to req
router.use((req, res, next) => { req.io = req.app.get('io'); next(); });

router.route('/').get(protect, getTasks).post(protect, createTask);
router.route('/:id').get(protect, getTask).put(protect, updateTask).delete(protect, adminOnly, deleteTask);
router.post('/:id/comments', protect, addComment);
router.put('/:id/subtasks/:subtaskId', protect, updateSubtask);

module.exports = router;
