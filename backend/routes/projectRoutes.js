const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProject, updateProject, deleteProject, getDashboardStats } = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, getDashboardStats);
router.route('/').get(protect, getProjects).post(protect, adminOnly, createProject);
router.route('/:id').get(protect, getProject).put(protect, adminOnly, updateProject).delete(protect, adminOnly, deleteProject);

module.exports = router;
