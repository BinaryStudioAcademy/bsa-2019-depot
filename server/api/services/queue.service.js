const amqp = require('amqplib/callback_api');
const { connectionUrl, emailQueue, repoDataQueue } = require('../../config/rabbitmq.config');
const { sendEmail } = require('../../helpers/email.helper');
const userRepository = require('../../data/repositories/user.repository');
const repoRepository = require('../../data/repositories/repository.repository');
const branchRepository = require('../../data/repositories/branch.repository');
const commitRepository = require('../../data/repositories/commit.repository');

let ch = null;

const syncDb = async (commits, branch) => {
  const { id: userId } = await userRepository.getByUsername(commits[0].repoOwner);
  const { id: repositoryId } = await repoRepository.getByUserAndReponame(userId, commits[0].repoName);
  const commitAuthors = await Promise.all(commits.map(({ userEmail }) => userRepository.getByEmail(userEmail)));
  const addedCommits = await Promise.all(commitAuthors.map(({ id: authorId }, index) => commitRepository.add({
    sha: commits[index].sha,
    message: commits[index].message,
    userId: authorId,
    createdAt: new Date(commits[index].createdAt),
    repositoryId
  })));
  const headCommitId = addedCommits.find(({ sha }) => sha === branch.newHeadSha).id;

  const existingBranch = await branchRepository.getByNameAndRepoId(branch.name, repositoryId);
  if (!existingBranch) {
    await branchRepository.create({
      name: branch.name,
      headCommitId,
      createdAt: addedCommits[addedCommits.length - 1].createdAt,
      repositoryId
    });
  } else {
    await branchRepository.updateById(existingBranch.id, {
      headCommitId
    });
  }
};

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
        await syncDb(commits, branch);
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
