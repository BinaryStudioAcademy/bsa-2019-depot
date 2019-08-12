const connectionUrl = process.env.RABBITMQ_CONNECTION_URL;
const queue = process.env.RABBITMQ_QUEUE_NAME;

module.exports = {
  connectionUrl,
  queue
};
