const logger = require("../config/logger");

async function getEmailConfig(channel) {
  logger.info("Fetching email configuration from PIM");

  // Example config
  return {
    provider: "sendgrid",
    apiKey: "XXXX",
  };
}

module.exports = {
  getEmailConfig,
};
