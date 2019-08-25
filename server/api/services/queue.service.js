const amqp = require('amqplib/callback_api');
const { connectionUrl, emailQueue, repoDataQueue } = require('../../config/rabbitmq.config');
const { sendEmail } = require('../../helpers/email.helper');

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

    ch.assertQueue(emailQueue, {
      durable: true
    });
    ch.assertQueue(repoDataQueue, {
      durable: true
    });

    ch.consume(
      emailQueue,
      (msg) => {
        const message = JSON.parse(msg.content);
        sendEmail(message);
      },
      { noAck: true }
    );
    ch.consume(
      repoDataQueue,
      (msg) => {
        const message = JSON.parse(msg.content.toString());
        console.log(message);
      },
      { noAck: true }
    );
  });
});

const sendToQueue = async (queueName, data) => {
  const message = JSON.stringify(data);
  ch.sendToQueue(queueName, Buffer.from(message), { persistent: true });
};

module.exports = {
  sendToQueue
};
