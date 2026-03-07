const { Kafka } = require("kafkajs");
const { v4: uuidv4 } = require("uuid");

const kafka = new Kafka({
  clientId: "email-test-producer",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

function generateMessage(priority, customerId) {
  return {
    trackingId: uuidv4(),
    from: "System BBB",
    to: "sakthivel samuthiram",
    subject: "Order Placed",
    body: "Your order is confirmed",
    channel: "email",
    priority: priority,
    customerId: customerId,
    status: "IN_PROGRESS",
    statusMessage: "Request delivered to email processor",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function sendMessages() {
  await producer.connect();

  const messages = [
    generateMessage("low", "AP33333"),
    generateMessage("low", "AP33333"),
    generateMessage("high", "AP12334"),
    generateMessage("high", "AP12334"),
    generateMessage("medium", "AP22222"),
    generateMessage("medium", "AP22222"),
    generateMessage("low", "AP33333"),
    generateMessage("low", "AP33333"),
  ];

  for (const msg of messages) {
    await producer.send({
      topic: "email",
      messages: [
        {
          key: msg.customerId,
          value: JSON.stringify(msg),
        },
      ],
    });

    console.log("Message sent:", msg.trackingId, msg.priority);
  }

  await producer.disconnect();
}

sendMessages().catch(console.error);
