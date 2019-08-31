const util = require('util');
const exec = util.promisify(require('child_process').exec);
const repoRepository = require('../../data/repositories/repository.repository');
const userRepository = require('../../data/repositories/user.repository');
const repoHelper = require('../../helpers/repo.helper');

const getBranchDiffs = async (repoId, fromBranch, toBranch) => {
  const { userId, name: reponame } = await repoRepository.getById(repoId);
  const { username: owner } = await userRepository.getUserById(userId);

  const pathToRepo = repoHelper.getPathToRepo(owner, reponame);

  const cdCommand = `cd  ${pathToRepo}`;
  const gitDiffCommand = `git diff -U1 ${toBranch}...${fromBranch}`;
  const command = `${cdCommand} && ${gitDiffCommand}`;
  const cmd = await exec(command);
  if (cmd.stderr) throw new Error(cmd.stderr);
  const diffsData = cmd.stdout.substring(cmd.stdout.indexOf('diff --git'));
  return { diffs: diffsData };
};

module.exports = { getBranchDiffs };
