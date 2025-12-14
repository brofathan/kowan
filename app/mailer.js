const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMagicLink(to, link) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Your Magic Login Link",
    html: `<p>Click to login:</p><a href="${link}">${link}</a>`,
  });
}

module.exports = { sendMagicLink };
