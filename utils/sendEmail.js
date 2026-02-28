// node mailer
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter (service that will send email like gmail, yahoo, outlook, sendgrid , mailtrap ,mailgun , etc)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure is true then port should be 465 otherwise 587
    secure: false,
    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASS,
    // },
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });
  //2) Define the email options (from, to, subject, text, html)
  const mailOptions = {
    from: "Souq <souq.maill@gmail.com>",
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  //3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
