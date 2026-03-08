const connectDB = require("../config/db");
const consumer = require("../config/kafka");
const logger = require("../config/logger");
const { getEmailConfig } = require("../services/pimService");
const { sendEmail } = require("../services/emailService");
const { updateStatus } = require("../repositories/notificationRepository");

async function startConsumer() {
  const collection = await connectDB();
  await consumer.connect();
  await consumer.subscribe({
    topic: "email",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());
      const { trackingId } = payload;
      logger.info("Email message received", { trackingId });

      if (trackingId) {
        const updatedRequest = {
          ...payload,
          status: "RECEIVED",
          statusMessage: `Request processed and submitted to ${payload.channel} service.`,
          createdAt: new Date(),
        };
        await collection.insertOne(updatedRequest);
      }
    },
  });

  /*await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());

      const { trackingId } = payload;
      try {
        logger.info("Email message received", { trackingId });

        //const config = await getEmailConfig("email");

        // await sendEmail(config, payload);

        await updateStatus(
          trackingId,
          "SEND",
          "Email successfully submitted to provider",
        );
        logger.info("Email processed successfully", { trackingId });
      } catch (error) {
        logger.error("Email processing failed", {
          trackingId,
          error: error.message,
        });

        await updateStatus(trackingId, "FAILED", error.message);
      }
    },
  });*/
}
async function processEmail(payload) {
  const { trackingId } = payload;

  const existing = await Notification.findOne({ trackingId });

  if (existing && existing.status === "SEND") {
    logger.warn("Duplicate message skipped", { trackingId });

    return;
  }

  const config = await getEmailConfig("pim-email");

  await sendEmail(config, payload);

  await updateStatus(trackingId, "SEND", "Email successfully submitted");
}

module.exports = startConsumer;
