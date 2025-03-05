import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use 'gmail' not 'smtp.gmail.com'
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address from .env
    pass: process.env.EMAIL_PASS, // your app password if using 2FA
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};
