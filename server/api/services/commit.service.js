const NodeGit = require('nodegit');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const repoHelper = require('../../helpers/repo.helper');

const initialCommit = async ({
  owner, email, repoName, files
}) => {
  const pathToRepo = repoHelper.getPathToRepo(owner, repoName);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const treeBuilder = await NodeGit.Treebuilder.create(repo, null);
  const authorSignature = NodeGit.Signature.now(owner, email);

  const fileBlobOids = await Promise.all(
    files.map(({ content, filename }) => {
      const fileBuffer = Buffer.from(content);
      return NodeGit.Blob.createFromBuffer(repo, fileBuffer, fileBuffer.length).then(oid => ({ oid, filename }));
    })
  );

  fileBlobOids.forEach(({ oid, filename }) => {
    treeBuilder.insert(filename, oid, NodeGit.TreeEntry.FILEMODE.BLOB);
  });

  const newCommitTree = await treeBuilder.write();
  const commitId = await repo.createCommit(
    'HEAD',
    authorSignature,
    authorSignature,
    'Initial commit',
    newCommitTree,
    []
  );

  const commit = await repo.getCommit(commitId);
  return NodeGit.Branch.create(repo, 'master', commit, 1);
};

module.exports = { initialCommit };

const { getReposNames, isEmpty } = require('./repo.service');

const getCommitCount = async ({ user, name, branch }) => {
  const commitListForBranch = await getCommits({ user, name, branch });
  return { count: commitListForBranch.length };
};

const getCommitsByDate = async (data) => {
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
      monthActivity[monthAndYear] = {};
    }
    if (!(monthAndYear in monthActivity)) {
      monthActivity[monthAndYear] = {};
    }
  });
  allCommits.forEach(({ date, repo }) => {
    const stringifiedDate = JSON.stringify(date);
    const monthAndYear = stringifiedDate.slice(1, 8);
    if (monthActivity[monthAndYear][repo]) {
      monthActivity[monthAndYear][repo] += 1;
    } else {
      monthActivity[monthAndYear][repo] = 1;
    }
  });
  return { userActivitybyDate, monthActivity };
};

const getCommits = async ({ user, name, branch }) => {
  const pathToRepo = repoHelper.getPathToRepo(user, name);
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

const getCommitDiff = async ({ user, name, hash }) => {
  const pathToRepo = repoHelper.getPathToRepo(user, name);
  const cdCommand = `cd  ${pathToRepo} `;
  const gitDiffCommand = `git diff ${hash}~ ${hash} -U`;
  const command = `${cdCommand} && ${gitDiffCommand}`;
  const cmd = await exec(command);
  if (cmd.stderr) throw new Error(cmd.stderr);
  return { diffs: cmd.stdout };
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

  return repo.getCommit(commitId);
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

  return repo.getCommit(commitId);
};

module.exports = {
  getCommits,
  getCommitDiff,
  getCommitsByDate,
  modifyFile,
  deleteFile,
  getCommitCount
};
