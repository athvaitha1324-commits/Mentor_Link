import { Router } from 'express';
import multer from 'multer';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import Task from '../models/Task.js';
import { uploadBufferToDrive } from '../utils/drive.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

router.get('/', requireAuth, async (req, res) => {
  const query = {};
  if (req.user.role === 'mentor') query.mentor = req.user._id;
  if (req.user.role === 'mentee') query.mentees = req.user._id;
  if (req.query.status) query.status = req.query.status;
  if (req.query.teamIdString) query.teamIdString = req.query.teamIdString;
  const tasks = await Task.find(query).sort('-createdAt');
  res.json(tasks);
});

router.post('/:id/attachment', requireAuth, requireRoles('mentor'), upload.single('file'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!req.file) return res.status(400).json({ message: 'No file' });
    const result = await uploadBufferToDrive({ buffer: req.file.buffer, mimeType: req.file.mimetype, name: req.file.originalname });
    task.attachment = { driveFileId: result.fileId, driveLink: result.link, originalName: result.name, mimeType: req.file.mimetype };
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Meeting link generation: default jitsi with team id
router.post('/:id/meeting-link', requireAuth, requireRoles('mentor'), async (req, res) => {
  const { customLink } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  const base = 'https://meet.jit.si/';
  const slug = task.teamIdString ? encodeURIComponent(task.teamIdString) : `task-${task._id}`;
  const link = customLink || `${base}${slug}`;
  task.meetingLink = link;
  await task.save();
  res.json({ meetingLink: link });
});

export default router;