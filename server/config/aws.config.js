const accessKey = process.env.AWS_SES_ACCESS_KEY;
const secretKey = process.env.AWS_SES_SECRET_KEY;
const awsRegion = process.env.AWS_SES_REGION;
const emailSender = process.env.AWS_SES_SENDER;
const bucket = process.env.AWS_S3_BUCKET;
const appPort = process.env.APP_PORT;

const options = {
  providerOptions: {
    s3: {
      getKey: (req, filename) => `${filename}`,
      key: accessKey,
      secret: secretKey,
      bucket,
      region: awsRegion
    }
  },
  server: {
    host: `localhost:${appPort}`,
    protocol: 'http'
  }
};
module.exports = {
  accessKey,
  secretKey,
  awsRegion,
  emailSender,
  options
};
