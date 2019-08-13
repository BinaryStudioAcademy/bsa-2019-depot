const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const UserRepository = require('../../data/repositories/user.repository');
const { createTokenEmail } = require('../../helpers/email.helper');

const { accessKey, secretKey, awsRegion } = require('../../config/aws.config');
const { emailQueue } = require('../../config/rabbitmq.config');

const secret = process.env.SECRET_KEY;

AWS.config.update({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  region: awsRegion
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

function sendEmail(message) {
  ses.sendEmail(message).promise();
}

const checkEmailExists = async ({ email }) => {
  const user = await UserRepository.getByEmail(email);
  return {
    emailExists: Boolean(user)
  };
};

module.exports = {
  sendForgetPasswordEmail,
  sendEmail
};

const { sendToQueue } = require('./queue.service.js');

async function sendForgetPasswordEmail({ email, url }) {
  const isExist = await checkEmailExists({ email });
  if (!isExist.emailExists) {
    return { failure: 'Email is not exist' };
  }
  const user = await UserRepository.getByEmail(email);
  const token = jwt.sign({ data: user.dataValues.email }, secret, { expiresIn: '1h' });
  const message = createTokenEmail(email, token, url);
  await sendToQueue(emailQueue, message);
  return { success: `Email with password reset link was sent to ${user.email}` };
}
