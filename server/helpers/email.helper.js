const AWS = require('aws-sdk');

const accessKey = process.env.AWS_SES_ACCESS_KEY;
const secretKey = process.env.AWS_SES_SECRET_KEY;
const awsRegion = process.env.AWS_SES_REGION;

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
          Data: `<html><body> <p>Hello. Your link for reset password is: ${token} </p></body></html>`
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
