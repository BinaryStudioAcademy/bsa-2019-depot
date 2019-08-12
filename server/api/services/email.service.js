const jwt = require('jsonwebtoken');
const amqp = require('amqplib/callback_api');
const AWS = require('aws-sdk');
const UserRepository = require('../../data/repositories/user.repository');
const { createTokenEmail } = require('../../helpers/email.helper');
const sendToQueue = require('./queue.service.js');

const { accessKey, secretKey, awsRegion } = require('../../config/aws.config');
const { connectionUrl, queue } = require('../../config/rabbitmq.config');

const secret = process.env.SECRET_KEY;

AWS.config.update({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  region: awsRegion
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

amqp.connect(connectionUrl, (err, connection) => {
  if (err) {
    throw err;
  }
  connection.createChannel((err1, channel) => {
    if (err1) {
      throw err1;
    }
    channel.consume(
      queue,
      (msg) => {
        const message = JSON.parse(msg.content);
        ses.sendEmail(message).promise();
      },
      { noAck: true }
    );
  });
});

const checkEmailExists = async ({ email }) => {
  const user = await UserRepository.getByEmail(email);
  return {
    emailExists: Boolean(user)
  };
};

const sendForgetPasswordEmail = async ({ email }) => {
  const isExist = await checkEmailExists({ email });
  if (!isExist.emailExists) {
    return { failure: 'Email is not exist' };
  }
  const user = await UserRepository.getByEmail(email);
  const token = jwt.sign({ data: user.dataValues.email }, secret, { expiresIn: '1h' });
  const message = createTokenEmail(email, token);
  await sendToQueue(queue, message);
  return { success: `Email with password reset link was sent to ${user.email}` };
};

module.exports = {
  sendForgetPasswordEmail
};
