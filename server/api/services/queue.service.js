const amqp = require('amqplib/callback_api');
const { connectionUrl, queue } = require('../../config/rabbitmq.config');

let ch = null;

amqp.connect(connectionUrl, (err, connection) => {
  if (err) {
    throw err;
  }
  connection.createChannel((err1, channel) => {
    if (err1) {
      throw err1;
    }
    ch = channel;
    ch.assertQueue(queue, {
      durable: true
    });
  });
});

module.exports = async (queueName, data) => {
  const message = JSON.stringify(data);
  ch.sendToQueue(queueName, Buffer.from(message), { persistent: true });
};
