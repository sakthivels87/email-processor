const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "email-processor",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "email-group-test" });

module.exports = consumer;
