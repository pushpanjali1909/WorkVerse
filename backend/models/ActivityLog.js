const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  entity: { type: String, enum: ['task', 'project', 'user', 'comment'], required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
