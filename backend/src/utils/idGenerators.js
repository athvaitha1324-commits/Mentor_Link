import crypto from 'crypto';

export function generateMentorId() {
  const random = crypto.randomInt(100, 999);
  return `M${random}`; // e.g., M101
}

export function generateMenteeId() {
  const random = crypto.randomInt(1000, 9999);
  return `S${random}`; // e.g., S4321
}

export function generateTeamId(department, gradYearOrBatch, mentorIdString) {
  const dept = (department || 'GEN').toUpperCase().slice(0, 3);
  const batch = gradYearOrBatch || new Date().getFullYear();
  return `${dept}_${batch}_${mentorIdString}`; // CSE_2025_M101
}