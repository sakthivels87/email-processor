require("dotenv").config();

const connectDB = require("./config/db");
const startConsumer = require("./consumers/emailConsumer");
const logger = require("./config/logger");

async function start() {
  try {
    await connectDB();

    await startConsumer();

    logger.info("Email processor started");
  } catch (error) {
    logger.error("Application failed to start", {
      error: error.message,
    });

    process.exit(1);
  }
}

start();
