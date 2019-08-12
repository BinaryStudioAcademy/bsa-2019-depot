const { passwordResetUrl } = require('../config/client.config');

const createTokenEmail = (email, token) => {
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
                    <p>${passwordResetUrl}${token} </p>
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
    Source: 'sandrk27@gmail.com', /* required */
  };
  return params;
};

module.exports = {
  createTokenEmail
};
