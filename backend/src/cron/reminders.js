import cron from 'node-cron';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Proof from '../models/Proof.js';
import { sendEmail } from '../utils/mailer.js';

function startReminders() {
  const schedule = process.env.REMINDER_CRON || '0 20 * * *';
  cron.schedule(schedule, async () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const activeTasks = await Task.find({ status: { $in: ['Assigned', 'Scheduled'] } });
    const menteeIdToMentorIdString = new Map();

    for (const task of activeTasks) {
      for (const menteeId of task.mentees) {
        const hasProof = await Proof.exists({ mentee: menteeId, createdAt: { $gte: todayStart, $lte: todayEnd } });
        if (!hasProof) {
          const mentee = await User.findById(menteeId);
          if (!mentee) continue;
          // Send mentee reminder
          if (mentee.email) {
            await sendEmail({
              to: mentee.email,
              subject: 'Daily Proof Reminder',
              text: `Please upload your daily proof for team ${mentee.teamIdString}.`,
            });
          }
          menteeIdToMentorIdString.set(menteeId.toString(), mentee.mentorIdString);
        }
      }
    }

    // Aggregate for mentor alerts
    const mentorToMentees = {};
    for (const [menteeId, mentorIdString] of menteeIdToMentorIdString.entries()) {
      if (!mentorToMentees[mentorIdString]) mentorToMentees[mentorIdString] = [];
      const mentee = await User.findById(menteeId);
      if (mentee) mentorToMentees[mentorIdString].push(mentee.name);
    }
    for (const mentorIdString of Object.keys(mentorToMentees)) {
      const mentor = await User.findOne({ role: 'mentor', mentorIdString });
      if (mentor?.email) {
        await sendEmail({
          to: mentor.email,
          subject: 'Missing Daily Submissions',
          text: `Mentees with missing submissions today: ${mentorToMentees[mentorIdString].join(', ')}`,
        });
      }
    }
  }, { timezone: process.env.TZ || 'UTC' });
}

export default startReminders;