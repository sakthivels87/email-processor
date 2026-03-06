const axios = require("axios");
const logger = require("../config/logger");

async function sendEmail(config, emailPayload) {
  try {
    logger.info("Sending email", { to: emailPayload.to });

    const response = await axios.post(
      "https://api.emailservice.com/send",
      {
        to: emailPayload.to,
        subject: emailPayload.subject,
        body: emailPayload.body,
      },
      {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    logger.error("Email sending failed", { error: error.message });

    throw error;
  }
}

module.exports = {
  sendEmail,
};
