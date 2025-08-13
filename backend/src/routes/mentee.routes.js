import { Router } from 'express';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import Task from '../models/Task.js';
import Proof from '../models/Proof.js';

const router = Router();

router.get('/tasks', requireAuth, requireRoles('mentee'), async (req, res) => {
  const tasks = await Task.find({ mentees: req.user._id }).sort('-createdAt');
  res.json(tasks);
});

router.post('/proofs', requireAuth, requireRoles('mentee'), async (req, res) => {
  const { taskId, driveFileId, driveLink, originalName, mimeType, notes } = req.body;
  const mentor = await (await import('../models/User.js')).default.findOne({ role: 'mentor', mentorIdString: req.user.mentorIdString });
  const proof = await Proof.create({
    mentee: req.user._id,
    mentor: mentor?._id,
    task: taskId,
    teamIdString: req.user.teamIdString,
    driveFileId,
    driveLink,
    originalName,
    mimeType,
    notes,
  });
  res.json(proof);
});

export default router;