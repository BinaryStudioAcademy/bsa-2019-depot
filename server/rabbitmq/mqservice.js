const amqp = require('amqplib/callback_api');
const { connectionUrl, queue } = require('../config/rabbitmq.config');

const ch = {};

amqp.connect(connectionUrl, (err, connection) => {
  connection.createChannel((err, channel) => {
    ch.value = channel;
    ch.value.assertQueue(queue, {
      durable: false
    });
    ch.value.sendToQueue(queue, Buffer.from(JSON.stringify('hello')));
  });
});


module.exports = async (queueName, data) => {
  const message = JSON.stringify(data);
  ch.value.sendToQueue(queueName, Buffer.from(message));
};


process.on('exit', (code) => {
  ch.close();
  console.log('Closing rabbitmq channel');
});
