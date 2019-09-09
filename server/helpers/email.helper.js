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

const createInviteEmail = (email, url, orgName, username) => {
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
          Data: `<html><body> 
                    <p>Hi!</p>
                    <p>You had been invited to join the @${orgName} organization on GitHub. 
                    Head over to ${url}/${orgName} to check out @${orgName}’s profile.</p>
                    <p>You can use the following link to join right now:</p>
                    <p>${url}/orgs/${orgName}/invitation</p>
                    <p>Note: If you get a 404 page, make sure you’re signed in as ${username}.</p>
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
        Data: 'Invite to the organization'
      }
    },
    Source: emailSender /* required */
  };
  return params;
};

const createInviteCollaboratorEmail = (email, url, username, reponame) => {
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
          Data: `<html><body> 
                    <p>Hi!</p>
                    <p>@${username} has invited you to collaborate on the <b>${username}/${reponame}</b> repository.
                    <p>You can <a href=${url}/${username}/${reponame}/invitations>accept or decline</a> this invitation. You can also visit <a href=${url}/${username}>@${url}/${username}</a> to learn a bit more about them.</p>
                    <p><b>Note:</b> This invitation was intended for <a href="mailto:${email}">${email}</a>. If you were not expecting this invitation, you can ignore this email. </p>
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
        Data: `${username} invited you to ${username}/${reponame}`
      }
    },
    Source: emailSender /* required */
  };
  return params;
};

const createReviewAssignmentEmail = (email, url, repoOwner, reponame, pullNumber, pullTitle) => {
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
          Data: `<html><body> 
                    <p>Your review was requested on: <a href="${url}/${repoOwner}/${reponame}/pulls/${pullNumber}">#${pullNumber}</a> ${pullTitle}</p>
                    </body></html>`
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'TEXT_FORMAT_BODY'
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `[${repoOwner}/${reponame}] ${pullTitle} (#${pullNumber})`
      }
    },
    Source: emailSender /* required */
  };
  return params;
};

const sendEmail = message => ses.sendEmail(message).promise();

module.exports = {
  createTokenEmail,
  createInviteEmail,
  createInviteCollaboratorEmail,
  createReviewAssignmentEmail,
  sendEmail
};
