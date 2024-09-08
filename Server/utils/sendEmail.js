const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a Nodemailer transporter using email credentials
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
    port: 465, // Port for SMTP (usually 465)
    secure: true, // Usually true if connecting to port 465
    auth: {
      user: "testdoubletest409@gmail.com", // Your email address
      pass: "aaux ssjd gukb qfwl", // Password (for gmail, your app password)
     
    },
});

// Function to send an email
module.exports = async function sendEmail(to, subject, text) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Sender's email address
            to,                           // Recipient's email address
            subject,                      // Email subject
            text                          // Email body
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
