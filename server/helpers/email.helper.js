const AWS = require('aws-sdk');
const { accessKey, secretKey, awsRegion } = require('../config/aws.config');
const { emailSender } = require('../config/aws.config');

AWS.config.update({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  region: awsRegion
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const createTokenEmail = (email, token, url) => {
  const params = {
    Destination: {
      /* required */
      ToAddresses: [
        email
        /* more items */
      ]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: `<html><body> <p>We heard that you lost your Depot password. Sorry about that!</p>
                    <p>But don’t worry! You can use the following link to reset your password: </p>
                    <p>${url}/reset/${token} </p>
                    <p>If you don’t use this link within 1 hour, it will expire.</p>
                    <p>Thanks,</p>
                    <p>Your friends at Depot</p>
                    </body></html>`
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'TEXT_FORMAT_BODY'
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Reset password Depot'
      }
    },
    Source: emailSender /* required */
  };
  return params;
};

const sendEmail = message => ses.sendEmail(message).promise();

module.exports = {
  createTokenEmail,
  sendEmail
};
