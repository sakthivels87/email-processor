const mongoose = require("mongoose");
const connectDB = require("../config/db");
const { logger } = require("../config/kafka");

const NotificationSchema = new mongoose.Schema({
  trackingId: String,
  status: String,
  statusMessage: String,
});

const Notification = mongoose.model(
  "notification-interactions",
  NotificationSchema,
);

async function updateStatus(trackingId, status, statusMessage) {
  const collection = await connectDB();
  console.log(
    "updateStatus:::::",
    trackingId,
    "----status--->",
    status,
    "----statusMessage--->",
    statusMessage,
  );
  try {
    // await collection.updateOne(
    //   { trackingId: trackingId },
    //   {
    //     $set: {
    //       status: status,
    //       statusMessage: statusMessage,
    //       updatedAt: new Date(),
    //     },
    //   },
    //   { upsert: true },
    // );
    logger.info("Successfully updated in mongodb.", trackingId);
  } catch (error) {
    message.statusMessage = "Request failed in processing will retry shortly.";

    await collection.insertOne(message);

    logger.error("Processing failed", error);

    throw error;
  }
}

module.exports = {
  updateStatus,
};
