const { getUserById } = require('./user.service');
const CommitRepository = require('../../data/repositories/commit.repository');
const CommitCommentRepository = require('../../data/repositories/commit-comment.repository');

const getCommitCommentById = commitCommentId => CommitCommentRepository.getById(commitCommentId);

const getCommitCommentsByCommitId = async (commitId) => {
  const commitComments = CommitCommentRepository.getByCommitId(commitId);
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

const createCommitComment = async (commitCommentData) => {
  const {
    sha, repoId, authorId, body
  } = commitCommentData;
  let commit = await CommitRepository.getByHash(sha);
  if (!commit) {
    commit = await CommitRepository.add({ sha, repoId });
  }

  const newCommitComment = await CommitCommentRepository.add({
    commitId: commit.id,
    authorId,
    body
  });
  return newCommitComment;
};

module.exports = {
  getCommitCommentById,
  getCommitCommentsByCommitId,
  createCommitComment
};
