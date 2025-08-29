import "dotenv/config";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_SMTP,
  port: Number(process.env.NODEMAILER_PORT) || 587,
  secure: Number(process.env.NODEMAILER_PORT) === 465,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const sendMail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to,
    subject,
    text,
  });
};
