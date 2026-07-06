// Placeholder — configure nodemailer or SES when email features are needed
const logger = require("@ecommerce/shared/src/utils/logger");

const sendMail = async ({ to, subject, html }) => {
  logger.info(`[mail] To: ${to} | Subject: ${subject}`);
};

module.exports = { sendMail };
