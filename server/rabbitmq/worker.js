const amqp = require('amqplib/callback_api');
const AWS = require('aws-sdk');
const { accessKey, secretKey, awsRegion } = require('../config/aws.config');
const { connectionUrl, queue } = require('../config/rabbitmq.config');

AWS.config.update({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  region: awsRegion
});
// const ses = new AWS.SES({ apiVersion: '2010-12-01' });

amqp.connect(connectionUrl, (err, conn) => {
  conn.createChannel((err, channel) => {
    channel.consume(
      queue,
      (msg) => {
        console.log('.....');
        const message = JSON.parse(msg.content.toString());
        // ses.sendEmail(message).promise();
        // setTimeout(() => {
        console.log('Message:', message);
        // }, 4000);
      },
      { noAck: true }
    );
  });
});
