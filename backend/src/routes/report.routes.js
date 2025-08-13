import { Router } from 'express';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import Task from '../models/Task.js';
import Proof from '../models/Proof.js';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

const router = Router();

router.get('/progress', requireAuth, async (req, res) => {
  const { teamIdString, menteeId } = req.query;
  const taskQuery = {};
  const proofQuery = {};
  if (teamIdString) taskQuery.teamIdString = proofQuery.teamIdString = teamIdString;
  if (menteeId) proofQuery.mentee = menteeId;
  const [tasks, proofs] = await Promise.all([
    Task.find(taskQuery),
    Proof.find(proofQuery),
  ]);
  const completed = tasks.filter(t => t.status === 'Completed').length;
  res.json({ totalTasks: tasks.length, completedTasks: completed, proofsCount: proofs.length });
});

router.get('/export', requireAuth, async (req, res) => {
  const { type = 'csv', scope = 'team', teamIdString } = req.query;
  const tasks = await Task.find(scope === 'team' && teamIdString ? { teamIdString } : {});
  const records = tasks.map(t => ({ id: t._id.toString(), title: t.title, status: t.status, deadline: t.deadline, teamIdString: t.teamIdString }));

  if (type === 'csv') {
    const parser = new Parser();
    const csv = parser.parse(records);
    res.header('Content-Type', 'text/csv');
    res.attachment('report.csv');
    return res.send(csv);
  }

  // PDF
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
  doc.pipe(res);
  doc.fontSize(18).text('Task Report', { underline: true });
  doc.moveDown();
  records.forEach(r => {
    doc.fontSize(12).text(`Title: ${r.title} | Status: ${r.status} | Deadline: ${r.deadline || '-'} | Team: ${r.teamIdString}`);
  });
  doc.end();
});

export default router;