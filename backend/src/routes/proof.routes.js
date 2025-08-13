import { Router } from 'express';
import multer from 'multer';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import Proof from '../models/Proof.js';
import User from '../models/User.js';
import { uploadBufferToDrive } from '../utils/drive.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

router.get('/', requireAuth, async (req, res) => {
  const query = {};
  if (req.user.role === 'mentee') query.mentee = req.user._id;
  if (req.user.role === 'mentor') query.mentor = req.user._id;
  if (req.query.teamIdString) query.teamIdString = req.query.teamIdString;
  const proofs = await Proof.find(query).sort('-createdAt');
  res.json(proofs);
});

router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file' });
    const result = await uploadBufferToDrive({ buffer: req.file.buffer, mimeType: req.file.mimetype, name: req.file.originalname });
    res.json({ driveFileId: result.fileId, driveLink: result.link, originalName: result.name, mimeType: req.file.mimetype });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

router.post('/', requireAuth, requireRoles('mentee'), async (req, res) => {
  const { taskId, driveFileId, driveLink, originalName, mimeType, notes } = req.body;
  const mentor = await User.findOne({ role: 'mentor', mentorIdString: req.user.mentorIdString });
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