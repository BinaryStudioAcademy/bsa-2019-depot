const jwt = require('jsonwebtoken');
const UserRepository = require('../../data/repositories/user.repository');
const { createTokenEmail } = require('../../helpers/email.helper');
const { emailQueue } = require('../../config/rabbitmq.config');

const secret = process.env.SECRET_KEY;

const checkEmailExists = async ({ email }) => {
  const user = await UserRepository.getByEmail(email);
  return {
    emailExists: Boolean(user)
  };
};

const { sendToQueue } = require('./queue.service.js');

async function sendForgetPasswordEmail({ email, url }) {
  const isExist = await checkEmailExists({ email });
  if (!isExist.emailExists) {
    const error = new Error('Email does not exist');
    error.status = 404;
    return Promise.reject(error);
  }
  const user = await UserRepository.getByEmail(email);
  const token = jwt.sign({ data: user.dataValues.email }, secret, { expiresIn: '1h' });
  const message = createTokenEmail(email, token, url);
  await sendToQueue(emailQueue, message);
  return {
    status: 200,
    message:
      'Check your email for a link to reset your password. If it doesn`t appear within a few minutes, check your spam folder.'
  };
}

module.exports = {
  sendForgetPasswordEmail
};
