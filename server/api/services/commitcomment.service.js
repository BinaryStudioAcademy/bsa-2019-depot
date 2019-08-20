const { getUserById } = require('./user.service');

const CommitCommentRepository = require('../../data/repositories/commitcomment.repository');

const getCommitCommentById = commitCommentId => CommitCommentRepository.getById(commitCommentId);

const getCommitCommentsByCommitId = async (commitId) => {
  const commitComments = CommitCommentRepository.getByCommitId(commitId);
  //   for (const comment of comments) {
  //     const { userId } = comment;
  //     const user = await getUserById(userId);
  //     const { username, name, imgUrl } = user;
  //     delete comment.userId;
  //     comment.authorId = userId;
  //     comment.author = { username, name, imgUrl };
  //   }
  if (!commitComments.length) {
    return [];
  }
  const users = await Promise.all(commitComments.map(comment => getUserById(comment.userId)));
  const comments = commitComments.map((item, idx) => {
    const comment = { ...item };
    delete comment.userId;
    const {
      id, username, name, imgUrl
    } = users[idx];
    comment.authorId = id;
    comment.author = {
      username,
      name,
      imgUrl
    };
    return item;
  });
  return comments;
};

module.exports = {
  getCommitCommentById,
  getCommitCommentsByCommitId
};
