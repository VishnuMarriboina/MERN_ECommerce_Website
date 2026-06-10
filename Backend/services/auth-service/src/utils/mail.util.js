// Placeholder — configure nodemailer or SES when email features are needed
const sendMail = async ({ to, subject, html }) => {
  console.log(`[mail] To: ${to} | Subject: ${subject}`);
};

module.exports = { sendMail };
