const amqp = require('amqplib/callback_api');
const { connectionUrl, emailQueue, repoDataQueue } = require('../../config/rabbitmq.config');
const { sendEmail } = require('../../helpers/email.helper');
const userRepository = require('../../data/repositories/user.repository');
const repoRepository = require('../../data/repositories/repository.repository');
const branchRepository = require('../../data/repositories/branch.repository');
const commitRepository = require('../../data/repositories/commit.repository');

let ch = null;

amqp.connect(connectionUrl, (err, connection) => {
  if (err) {
    throw err;
  }
  connection.createChannel((err1, channel) => {
    if (err1) {
      throw err1;
    }
    ch = channel;

    ch.assertQueue(emailQueue, {
      durable: true
    });
    ch.assertQueue(repoDataQueue, {
      durable: true
    });

    ch.consume(
      emailQueue,
      (msg) => {
        const message = JSON.parse(msg.content);
        sendEmail(message);
      },
      { noAck: true }
    );
    ch.consume(
      repoDataQueue,
      async (msg) => {
        const { commits, branch } = JSON.parse(msg.content.toString());

        const { id: userId } = await userRepository.getByUsername(commits[0].repoOwner);
        const { id: repositoryId } = await repoRepository.getByUserAndReponame(userId, commits[0].repoName);
        const commitAuthors = await Promise.all(commits.map(({ userEmail }) => userRepository.getByEmail(userEmail)));
        const addedCommits = await Promise.all(commitAuthors.map(({ id: authorId }, index) => {
          return commitRepository.add({
            sha: commits[index].sha,
            message: commits[index].message,
            userId: authorId,
            repositoryId
          });
        }));
        const headCommitId = addedCommits.find(({ sha }) => sha === branch.newHeadSha).id;

        await branchRepository.upsert({
          name: branch.name,
          headCommitId,
          repositoryId
        });
      },
      { noAck: true }
    );
  });
});

const sendToQueue = async (queueName, data) => {
  const message = JSON.stringify(data);
  ch.sendToQueue(queueName, Buffer.from(message), { persistent: true });
};

module.exports = {
  sendToQueue
};
