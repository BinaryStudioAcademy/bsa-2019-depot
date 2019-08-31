const NodeGit = require('nodegit');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const repoHelper = require('../../helpers/repo.helper');
const { getReposNames, isEmpty } = require('./repo.service');
const CommitRepository = require('../../data/repositories/commit.repository');
const userRepository = require('../../data/repositories/user.repository');
const RepoRepository = require('../../data/repositories/repository.repository');
const CustomError = require('../../helpers/error.helper');

const getCommitsAndCreatedRepoByDate = async (data) => {
  const { user } = data;
  const repoList = await getReposNames(data);
  let globalCommits = [];
  const promises = repoList.map((repoName) => {
    const pathToRepo = repoHelper.getPathToRepo(user, repoName);
    return NodeGit.Repository.open(pathToRepo).then((repo) => {
      isEmpty({ owner: user, reponame: repo });
      const walker = NodeGit.Revwalk.create(repo);
      walker.pushGlob('refs/heads/*');
      walker.sorting(NodeGit.Revwalk.SORT.TIME);
      return walker
        .getCommitsUntil(commit => commit)
        .then((commits) => {
          const repoCommits = commits.map(commit => ({
            sha: commit.sha(),
            author: commit.author().name(),
            date: commit.date(),
            message: commit.message().split('\n')[0],
            repo: repoName
          }));
          globalCommits = globalCommits.concat(repoCommits);
        });
    });
  });

  const allCommits = await Promise.all(promises).then(() => Promise.resolve(globalCommits));
  const username = user;
  const dbUser = await userRepository.getByUsername(username);
  if (!dbUser) {
    return Promise.reject(new CustomError(404, `User ${username} not found`));
  }
  const { id } = dbUser;
  const repos = await RepoRepository.getByUserWithOptions(id);
  const userRepos = repos.map(repo => repo.get({ plain: true }));
  const userActivitybyDate = {};
  const monthActivity = {};
  allCommits.forEach(({ date }) => {
    const stringifiedDate = JSON.stringify(date);
    const fullDate = stringifiedDate.slice(1, 11);
    const monthAndYear = stringifiedDate.slice(1, 8);
    if (fullDate in userActivitybyDate) {
      userActivitybyDate[fullDate] += 1;
    } else {
      userActivitybyDate[fullDate] = 1;
    }
    if (!(monthAndYear in monthActivity)) {
      monthActivity[monthAndYear] = {
        commits: {}
      };
    }
  });
  userRepos.forEach(({ createdAt }) => {
    const stringifiedDate = JSON.stringify(createdAt);
    const fullDate = stringifiedDate.slice(1, 11);
    const monthAndYear = stringifiedDate.slice(1, 8);
    if (fullDate in userActivitybyDate) {
      userActivitybyDate[fullDate] += 1;
    } else {
      userActivitybyDate[fullDate] = 1;
    }
    monthActivity[monthAndYear] = {
      ...monthActivity[monthAndYear],
      createdRepos: []
    };
  });
  allCommits.forEach(({ date, repo }) => {
    const stringifiedDate = JSON.stringify(date);
    const monthAndYear = stringifiedDate.slice(1, 8);
    if (monthActivity[monthAndYear].commits[repo]) {
      monthActivity[monthAndYear].commits[repo] += 1;
    } else {
      monthActivity[monthAndYear].commits[repo] = 1;
    }
  });
  userRepos.forEach(({ name, createdAt }) => {
    const stringifiedDate = JSON.stringify(createdAt);
    const monthAndYear = stringifiedDate.slice(1, 8);
    monthActivity[monthAndYear].createdRepos.push(name);
  });
  return { userActivitybyDate, monthActivity };
};

const getCommits = async (branch, repoId) => {
  const { name, userId } = await RepoRepository.getById(repoId);
  const { username } = await userRepository.getById(userId);
  const pathToRepo = repoHelper.getPathToRepo(username, name);
  const allCommits = [];
  await NodeGit.Repository.open(pathToRepo)
    .then(repo => repo.getBranchCommit(branch))
    .then((firstCommitOnMaster) => {
      const history = firstCommitOnMaster.history(NodeGit.Revwalk.SORT.TIME);
      const commitPromise = new Promise((resolve) => {
        history.on('commit', (commit) => {
          const commitObject = {
            sha: commit.sha(),
            author: commit.author().name(),
            date: commit.date(),
            message: commit.message()
          };
          allCommits.push(commitObject);
        });
        history.on('end', () => {
          resolve();
        });
      });
      history.start();
      return commitPromise;
    });
  return allCommits;
};

const getCommitCount = async (branch, repoId) => {
  const commitListForBranch = await getCommits(branch, repoId);
  return { count: commitListForBranch.length };
};

const getCommitDiff = async ({ user, name, hash }) => {
  const pathToRepo = repoHelper.getPathToRepo(user, name);

  const cdCommand = `cd  ${pathToRepo} `;

  const gitDiffCommand = `git show ${hash}`;
  const command = `${cdCommand} && ${gitDiffCommand}`;
  const cmd = await exec(command);
  if (cmd.stderr) throw new Error(cmd.stderr);
  const diffsData = cmd.stdout.substring(cmd.stdout.indexOf('diff --git'));
  const response = { diffs: diffsData };
  const commit = await CommitRepository.getByHash(hash);
  if (commit) {
    response.id = commit.id;
  }
  return response;
};

const modifyFile = async ({
  owner,
  repoName,
  author,
  email,
  baseBranch,
  commitBranch,
  message,
  oldFilepath,
  filepath,
  fileData
}) => {
  const pathToRepo = repoHelper.getPathToRepo(owner, repoName);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const lastCommitOnBranch = await repo.getBranchCommit(baseBranch);
  const lastCommitTree = await lastCommitOnBranch.getTree();
  const authorSignature = NodeGit.Signature.now(author, email);
  const index = await repo.index();

  if (baseBranch !== commitBranch) {
    await NodeGit.Branch.create(repo, commitBranch, lastCommitOnBranch, 1);
  }
  const branchRef = `refs/heads/${commitBranch}`;

  const fileBuffer = Buffer.from(fileData);
  const oid = await NodeGit.Blob.createFromBuffer(repo, fileBuffer, fileBuffer.length);

  const indexEntry = new NodeGit.IndexEntry();
  indexEntry.path = filepath;
  indexEntry.id = oid;
  indexEntry.mode = NodeGit.TreeEntry.FILEMODE.BLOB;

  await index.readTree(lastCommitTree);
  if (oldFilepath !== filepath) {
    index.remove(oldFilepath, 0); // 0 === NodeGit.Index.STAGE.NORMAL, but this Enum doesn't work for some reason
  }
  await index.add(indexEntry);
  const newCommitTree = await index.writeTree();

  const commitId = await repo.createCommit(branchRef, authorSignature, authorSignature, message, newCommitTree, [
    lastCommitOnBranch
  ]);

  const commit = await repo.getCommit(commitId);

  await repoHelper.syncDb(
    [
      {
        repoOwner: owner,
        repoName,
        sha: commit.sha(),
        message,
        userEmail: email,
        createdAt: new Date()
      }
    ],
    {
      name: commitBranch,
      newHeadSha: commit.sha()
    }
  );

  return commit;
};

const deleteFile = async ({
  owner, repoName, branch, author, email, filepath
}) => {
  const pathToRepo = repoHelper.getPathToRepo(owner, repoName);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const lastCommitOnBranch = await repo.getBranchCommit(branch);
  const lastCommitTree = await lastCommitOnBranch.getTree();
  const authorSignature = NodeGit.Signature.now(author, email);
  const branchRef = `refs/heads/${branch}`;
  const index = await repo.index();

  await index.readTree(lastCommitTree);
  index.remove(filepath, 0); // 0 === NodeGit.Index.STAGE.NORMAL, but this Enum doesn't work for some reason
  const newCommitTree = await index.writeTree();

  const commitId = await repo.createCommit(
    branchRef,
    authorSignature,
    authorSignature,
    `Deleted ${filepath}`,
    newCommitTree,
    [lastCommitOnBranch]
  );

  const commit = await repo.getCommit(commitId);

  await repoHelper.syncDb(
    [
      {
        repoOwner: owner,
        repoName,
        sha: commit.sha(),
        message: `Deleted ${filepath}`,
        userEmail: email,
        createdAt: new Date()
      }
    ],
    {
      name: branch,
      newHeadSha: commit.sha()
    }
  );

  return commit;
};

const createCommit = async ({ ...commitData }) => {
  try {
    const commit = await CommitRepository.add(commitData);
    return commit;
  } catch (err) {
    return Promise.reject(new Error(err.message));
  }
};

const getRepoByCommitId = async (commitId)  => {
  try {
    return await CommitRepository.getRepoByCommitId(commitId);
  } catch (err) {
    return Promise.reject(new Error(err.message));
  }
};

module.exports = {
  getCommits,
  getCommitDiff,
  getCommitsAndCreatedRepoByDate,
  modifyFile,
  deleteFile,
  createCommit,
  getCommitCount,
  getRepoByCommitId
};
