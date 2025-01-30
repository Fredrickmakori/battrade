// src/services/email.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Or your email provider
  auth: {
    user: process.env.REACT_APP_EMAIL_USER, // Get from environment variables
    pass: process.env.REACT_APP_EMAIL_PASS, // Get from environment variables
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.REACT_APP_EMAIL_USER,
    to,
    subject,
    html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw to handle in the component
  }
};
