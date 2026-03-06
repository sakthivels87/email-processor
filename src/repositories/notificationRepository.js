const mongoose = require("mongoose");

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
  await Notification.updateOne(
    { trackingId },
    {
      status,
      statusMessage,
    },
  );
}

module.exports = {
  updateStatus,
};
