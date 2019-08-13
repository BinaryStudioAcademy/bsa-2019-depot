const connectionUrl = process.env.RABBITMQ_CONNECTION_URL;
const emailQueue = process.env.EMAIL_QUEUE_NAME;

module.exports = {
  connectionUrl,
  emailQueue
};
