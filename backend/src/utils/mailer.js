import nodemailer from 'nodemailer';

export function createTransporter() {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  const transporter = createTransporter();
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html, text });
}