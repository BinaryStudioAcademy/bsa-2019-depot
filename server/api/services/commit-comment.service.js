const { getUserById } = require('./user.service');
const CommitRepository = require('../../data/repositories/commit.repository');
const CommitCommentRepository = require('../../data/repositories/commit-comment.repository');
const UserRepository = require('../../data/repositories/user.repository');
const RepoRepository = require('../../data/repositories/repository.repository');

const getCommitCommentById = commitCommentId => CommitCommentRepository.getById(commitCommentId);

const getCommitCommentsByCommitId = async (commitId) => {
  const commitComments = await CommitCommentRepository.getByCommitId(commitId);
  if (!commitComments.length) {
    return [];
  }
  const users = await Promise.all(commitComments.map(comment => getUserById(comment.userId)));
  const comments = commitComments.map((item, idx) => {
    const {
      id, body, createdAt, updatedAt
    } = item;
    const comment = {
      id,
      commitId,
      author: {},
      body,
      createdAt,
      updatedAt
    };
    const {
      id: userId, username, name, imgUrl
    } = users[idx];
    comment.author = {
      id: userId,
      username,
      name,
      imgUrl
    };
    return comment;
  });
  return comments;
};

const createCommitComment = async (commitCommentData) => {
  const {
    sha, username, reponame, body
  } = commitCommentData;

  const user = await UserRepository.getByUsername(username);
  const { id: userId, name, imgUrl } = user;

  const repo = await RepoRepository.getByUserAndReponame(userId, reponame);
  const { repoId } = repo;
  let commit = await CommitRepository.getBySha(sha);
  if (!commit) {
    commit = await CommitRepository.add({ sha, repoId });
  }

  const addedComment = await CommitCommentRepository.add({
    commitId: commit.id,
    userId,
    body
  });
  const {
    id, commitId, body: commentBody, updatedAt, createdAt
  } = addedComment;
  const newCommitComment = {
    id,
    commitId,
    body: commentBody,
    updatedAt,
    createdAt
  };

  newCommitComment.author = {
    id: userId,
    name,
    username,
    imgUrl
  };
  return newCommitComment;
};

module.exports = {
  getCommitCommentById,
  getCommitCommentsByCommitId,
  createCommitComment
};
