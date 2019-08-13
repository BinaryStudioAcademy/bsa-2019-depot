const accessKey = process.env.AWS_SES_ACCESS_KEY;
const secretKey = process.env.AWS_SES_SECRET_KEY;
const awsRegion = process.env.AWS_SES_REGION;
const emailSender = process.env.AWS_SES_SENDER;

module.exports = {
  accessKey,
  secretKey,
  awsRegion,
  emailSender
};
