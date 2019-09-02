const { getUserById } = require('./user.service');
const CommitRepository = require('../../data/repositories/commit.repository');
const CommitCommentRepository = require('../../data/repositories/commit-comment.repository');
const UserRepository = require('../../data/repositories/user.repository');
const RepoRepository = require('../../data/repositories/repository.repository');
const CustomError = require('../../helpers/error.helper');
const { checkCommitCommentPermissions } = require('../../helpers/check.permission.level.helper');

const getCommitCommentById = async (commitCommentId) => {
  const commitComment = await CommitCommentRepository.getCommitCommentById(commitCommentId);
  return commitComment || Promise.reject(new CustomError(404, `Comment with id ${commitCommentId} not found`));
};

const getCommitCommentsByCommitId = async (commitId) => {
  try {
    const commit = await CommitRepository.getById(commitId);
    if (!commit) {
      return Promise.reject(new CustomError(404, `Commit with id ${commitId} does not exist in database`));
    }
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
  } catch (err) {
    return Promise.reject(new CustomError(500, err.message));
  }
};

const createCommitComment = async (commitCommentData) => {
  try {
    const {
      hash, username, reponame, body
    } = commitCommentData;

    const user = await UserRepository.getByUsername(username);
    const { id: userId, name, imgUrl } = user;

    const repo = await RepoRepository.getByUserAndReponame(userId, reponame);
    const { id: repositoryId } = repo;
    let commit = await CommitRepository.getByHash(hash);
    if (!commit) {
      commit = await CommitRepository.add({ sha: hash, repositoryId });
    }

    const addedComment = await CommitCommentRepository.addCommitComment({
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
  } catch (err) {
    return Promise.reject(new Error(err.message));
  }
};

const updateCommitComment = async (commitCommentData) => {
  try {
    const {
      id, body, commitId, userId
    } = commitCommentData;

    const commitComment = await CommitCommentRepository.getCommitCommentById(id);
    const isAccessGranted = checkCommitCommentPermissions(commitId, userId);

    if (!commitComment) {
      return Promise.reject(new CustomError(400, `Comment with id ${id} does not exist.`));
    }
    const { userId: commentUserId } = commitComment;
    if (userId !== commentUserId && !isAccessGranted) {
      return Promise.reject(new CustomError(401, `User with id ${userId} is not allowed to update this comment.`));
    }

    await CommitCommentRepository.updateCommitCommentById(id, {
      commitId,
      userId,
      body
    });

    const updatedComment = await CommitCommentRepository.getCommitCommentById(id);

    const { body: updatedBody, createdAt, updatedAt } = updatedComment;
    const updatedCommitComment = {
      id,
      commitId,
      body: updatedBody,
      updatedAt,
      createdAt
    };

    const user = await UserRepository.getById(userId);
    const { username, name, imgUrl } = user;
    updatedCommitComment.author = {
      id: userId,
      name,
      username,
      imgUrl
    };
    return updatedCommitComment;
  } catch (err) {
    return Promise.reject(new Error(err.message));
  }
};

const deleteCommitComment = async (id, userId) => {
  try {
    const comment = await CommitCommentRepository.getCommitCommentById(id);
    if (!comment) {
      return Promise.reject(new CustomError(404, `Commit comment with ${id} does not exist.`));
    }
    const { userId: commitUserId } = comment;
    const isAccessGranted = checkCommitCommentPermissions(id, userId);

    if (commitUserId !== userId && !isAccessGranted) {
      return Promise.reject(new CustomError(400, `User with ${userId} is not allowed to delete comment ${id}.`));
    }
    const result = await CommitCommentRepository.deleteCommitCommentById(id);
    if (!result) {
      return Promise.reject(new CustomError(400, `Cannot delete comment ${id}`));
    }
    return result;
  } catch (err) {
    return Promise.reject(new CustomError(500, err.message));
  }
};

module.exports = {
  getCommitCommentById,
  getCommitCommentsByCommitId,
  createCommitComment,
  updateCommitComment,
  deleteCommitComment
};
