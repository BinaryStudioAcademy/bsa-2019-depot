const NodeGit = require('nodegit');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const repoHelper = require('../../helpers/repo.helper');
const { getReposNames /* isEmpty */ } = require('./repo.service');
const CommitRepository = require('../../data/repositories/commit.repository');
const userRepository = require('../../data/repositories/user.repository');
const branchRepository = require('../../data/repositories/branch.repository');
const RepoRepository = require('../../data/repositories/repository.repository');
const CustomError = require('../../helpers/error.helper');
const CommitActivityHelper = require('../../helpers/commit-activity.helper');
const CommitActivityByUserHelper = require('../../helpers/commit-activity-by-user.helper');

const getCommitsAndCreatedRepoByDate = async (data) => {
  const { user, isOwner } = data;
  const repoList = await getReposNames(data);

  let globalCommits = [];
  const promises = repoList.map((reponame) => {
    const pathToRepo = repoHelper.getPathToRepo(user, reponame);
    return NodeGit.Repository.open(pathToRepo).then((repo) => {
      // isEmpty({ owner: user, reponame: repo });
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
            repo: reponame
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
  const repos = await RepoRepository.getByUserWithOptions(id, isOwner);
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
  const repository = await RepoRepository.getById(repoId);
  if (!repository) {
    return Promise.reject(new CustomError(404, `Repository with id ${repoId} not found`));
  }
  const { name, userId } = repository;
  const { username } = await userRepository.getById(userId);
  const dbBranch = await branchRepository.getByNameAndRepoId(branch, repoId);
  if (!dbBranch) {
    return Promise.reject(new CustomError(404, `Branch ${branch} not found in repository with id ${repoId} not found`));
  }
  const pathToRepo = repoHelper.getPathToRepo(username, name);
  const commitShas = [];
  await NodeGit.Repository.open(pathToRepo)
    .then(repo => repo.getBranchCommit(branch))
    .then((firstCommitOnMaster) => {
      const history = firstCommitOnMaster.history(NodeGit.Revwalk.SORT.TIME);
      const commitPromise = new Promise((resolve) => {
        history.on('commit', (commit) => {
          commitShas.push(commit.sha());
        });
        history.on('end', () => {
          resolve();
        });
      });
      history.start();
      return commitPromise;
    });
  return Promise.all(commitShas.map(sha => CommitRepository.getByHash(sha)));
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
  reponame,
  author,
  email,
  baseBranch,
  commitBranch,
  message,
  oldFilepath,
  filepath,
  fileData
}) => {
  const pathToRepo = repoHelper.getPathToRepo(owner, reponame);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const lastCommitOnBranch = await repo.getBranchCommit(baseBranch);
  const lastCommitTree = await lastCommitOnBranch.getTree();
  const authorSignature = NodeGit.Signature.now(author, email);
  const index = await repo.refreshIndex();

  if (baseBranch !== commitBranch) {
    await NodeGit.Branch.create(repo, commitBranch, lastCommitOnBranch, 1);
  }
  const branchRef = `refs/heads/${commitBranch}`;

  const fileBuffer = Buffer.from(fileData);
  const oid = await NodeGit.Blob.createFromBuffer(repo, fileBuffer, fileBuffer.length);

  const indexEntry = new NodeGit.IndexEntry();
  indexEntry.flags = 0;
  indexEntry.path = filepath;
  indexEntry.id = oid;
  indexEntry.mode = NodeGit.TreeEntry.FILEMODE.BLOB;

  await index.readTree(lastCommitTree);
  if (oldFilepath !== filepath) {
    await index.remove(oldFilepath, 0); // 0 === NodeGit.Index.STAGE.NORMAL, but this Enum doesn't work for some reason
  }
  await index.add(indexEntry);
  await index.write();
  const newCommitTree = await index.writeTree();

  const commitId = await repo.createCommit(branchRef, authorSignature, authorSignature, message, newCommitTree, [
    lastCommitOnBranch
  ]);

  const commit = await repo.getCommit(commitId);

  await repoHelper.syncDb(
    [
      {
        repoOwner: owner,
        reponame,
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
  owner, reponame, branch, author, email, filepath
}) => {
  const pathToRepo = repoHelper.getPathToRepo(owner, reponame);
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
        reponame,
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

const getRepoByCommitId = async (commitId) => {
  try {
    return await CommitRepository.getRepoByCommitId(commitId);
  } catch (err) {
    return Promise.reject(new Error(err.message));
  }
};

const getCommitActivityData = async (repositoryId) => {
  try {
    const commits = await CommitRepository.getAllRepoCommits(repositoryId);
    return CommitActivityHelper.getCommitActivity(commits);
  } catch (err) {
    return Promise.reject(new Error(err.message));
  }
};

const getUsersCommitsByRepositoryId = async (repositoryId) => {
  try {
    const currentRepo = await RepoRepository.getById(repositoryId);
    let defaultBranchActivity = [];
    const { createdAt: createdRepoDate, defaultBranch } = currentRepo;
    const usersCommits = await userRepository.getUsersCommits(repositoryId);
    if (defaultBranch) {
      const commitsInDefaultBranch = await getCommits(defaultBranch.name, repositoryId);
      defaultBranchActivity = CommitActivityByUserHelper.getActivityByUser(commitsInDefaultBranch, createdRepoDate);
    }

    const usersActivity = usersCommits.map((user) => {
      const {
        id, username, commits, imgUrl
      } = user.get({ plain: true });
      const byWeeks = CommitActivityByUserHelper.getActivityByUser(commits, createdRepoDate);
      return {
        id,
        username,
        imgUrl,
        commitsCount: commits.length,
        activity: byWeeks
      };
    });

    return {
      defaultBranchActivity,
      usersActivity
    };
  } catch (error) {
    return Promise.reject(new Error(error.message));
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
  getRepoByCommitId,
  getCommitActivityData,
  getUsersCommitsByRepositoryId
};
