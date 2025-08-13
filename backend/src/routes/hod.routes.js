import { Router } from 'express';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Proof from '../models/Proof.js';

const router = Router();

router.get('/overview', requireAuth, requireRoles('hod'), async (req, res) => {
  const { department } = req.query;
  const dept = department || req.user.department;
  const mentors = await User.find({ role: 'mentor', department: dept }).select('-passwordHash');
  const mentees = await User.find({ role: 'mentee', department: dept }).select('-passwordHash');
  res.json({ mentors, mentees });
});

router.get('/teams', requireAuth, requireRoles('hod'), async (req, res) => {
  const { department, year } = req.query;
  const dept = department || req.user.department;
  const mentees = await User.find({ role: 'mentee', department: dept, ...(year ? { year } : {}) }).select('teamIdString name menteeIdString mentorIdString year');
  const teams = mentees.reduce((acc, m) => {
    acc[m.teamIdString] = acc[m.teamIdString] || { teamIdString: m.teamIdString, mentorIdString: m.mentorIdString, year: m.year, mentees: [] };
    acc[m.teamIdString].mentees.push({ id: m._id, name: m.name, menteeIdString: m.menteeIdString });
    return acc;
  }, {});
  res.json(Object.values(teams));
});

router.get('/team/:teamIdString/progress', requireAuth, requireRoles('hod'), async (req, res) => {
  const { teamIdString } = req.params;
  const tasks = await Task.find({ teamIdString });
  const proofs = await Proof.find({ teamIdString });
  res.json({ tasksCount: tasks.length, proofsCount: proofs.length });
});

// Mentor mode: inspect a mentor's data
router.get('/mentor/:mentorIdString/mentees', requireAuth, requireRoles('hod'), async (req, res) => {
  const { mentorIdString } = req.params;
  const mentees = await User.find({ role: 'mentee', mentorIdString }).select('-passwordHash');
  res.json(mentees);
});

router.get('/mentor/:mentorIdString/tasks', requireAuth, requireRoles('hod'), async (req, res) => {
  const mentor = await User.findOne({ role: 'mentor', mentorIdString: req.params.mentorIdString });
  if (!mentor) return res.status(404).json({ message: 'Mentor not found' });
  const tasks = await Task.find({ mentor: mentor._id }).sort('-createdAt');
  res.json(tasks);
});

export default router;