import { Router } from 'express';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

const router = Router();

// Get mentees under mentor by team or all
router.get('/mentees', requireAuth, requireRoles('mentor'), async (req, res) => {
  const mentor = req.user;
  const mentees = await User.find({ role: 'mentee', mentorIdString: mentor.mentorIdString }).select('-passwordHash');
  res.json(mentees);
});

// Assign task to multiple mentees
router.post('/assign-task', requireAuth, requireRoles('mentor'), async (req, res) => {
  const mentor = req.user;
  const { title, description, deadline, menteeIds, teamIdString } = req.body;
  const task = await Task.create({
    title,
    description,
    deadline,
    mentor: mentor._id,
    mentees: menteeIds,
    teamIdString: teamIdString || undefined,
  });
  res.json(task);
});

// Update task status
router.patch('/tasks/:id', requireAuth, requireRoles('mentor'), async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// Mentor notes per mentee
router.post('/mentees/:id/notes', requireAuth, requireRoles('mentor'), async (req, res) => {
  const { note } = req.body;
  await User.findByIdAndUpdate(req.params.id, { $set: { [`notes.${req.user._id}`]: note } });
  res.json({ ok: true });
});

export default router;