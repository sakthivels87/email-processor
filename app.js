require("dotenv").config();

const connectDB = require("./src/config/db");
const startConsumer = require("./src/consumers/emailConsumer");
const logger = require("./src/config/logger");

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
