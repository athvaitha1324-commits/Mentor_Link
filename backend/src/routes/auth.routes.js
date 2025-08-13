import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateMentorId, generateMenteeId, generateTeamId } from '../utils/idGenerators.js';

const router = Router();

function sign(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', {
    expiresIn: '7d',
  });
}

// Mentor registration
router.post('/register/mentor', async (req, res) => {
  try {
    const { name, email, password, department, designation, hodId } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);

    const mentorIdString = generateMentorId();

    const user = await User.create({
      role: 'mentor',
      name,
      email,
      passwordHash,
      department,
      designation,
      hodId,
      mentorIdString,
    });

    const token = sign(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Mentee registration
router.post('/register/mentee', async (req, res) => {
  try {
    const { name, email, password, department, year, mentorIdString, gradYearOrBatch } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);

    const menteeIdString = generateMenteeId();
    const teamIdString = generateTeamId(department, gradYearOrBatch, mentorIdString);

    const mentor = await User.findOne({ role: 'mentor', mentorIdString });
    const hodId = mentor?.hodId;

    const user = await User.create({
      role: 'mentee',
      name,
      email,
      passwordHash,
      department,
      year,
      hodId,
      mentorIdString,
      menteeIdString,
      teamIdString,
    });

    const token = sign(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// HOD registration
router.post('/register/hod', async (req, res) => {
  try {
    const { name, email, password, department, designation } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      role: 'hod',
      name,
      email,
      passwordHash,
      department,
      designation,
    });

    const token = sign(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = sign(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// List mentors for dropdown
router.get('/mentors', async (req, res) => {
  const mentors = await User.find({ role: 'mentor' }).select('name email department designation mentorIdString');
  res.json(mentors);
});

// List HODs for dropdown
router.get('/hods', async (req, res) => {
  const hods = await User.find({ role: 'hod' }).select('name email department designation');
  res.json(hods);
});

export default router;