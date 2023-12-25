const nodemailer = require('nodemailer');

// Google email Setup
// const sendEmail = (options) => {
//   // 1. Create Transporter - Service to send the email
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },

//     // Activate less secure app options
//   });

//   // 2. Define Email Options

//   // 3. Send the Email
// };

//
const sendEmail = async (options) => {
  //   1. Create Transporter - Service to send the email
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. Define Email Options
  const mailOptions = {
    from: 'Adewunmi Joseph <hello@ze.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Send the Email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
  //   await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
