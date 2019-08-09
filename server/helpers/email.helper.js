const AWS = require('aws-sdk');
const { accessKey, secretKey, awsRegion } = require('../config/aws.config');

AWS.config.update({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  region: awsRegion
});


const sendTokenEmail = (email, token) => {
  const ses = new AWS.SES({ apiVersion: '2010-12-01' });
  const params = {
    Destination: { /* required */
      ToAddresses: [
        email,
        /* more items */
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
          Charset: 'UTF-8',
          Data: `<html><body> <p>We heard that you lost your Depot password. Sorry about that!</p>
                    <p>But don’t worry! You can use the following link to reset your password: </p>
                    <p>${token} </p>
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
    Source: 'andreoven@gmail.com', /* required */
  };
  ses.sendEmail(params).promise();
};

module.exports = {
  sendTokenEmail
};
