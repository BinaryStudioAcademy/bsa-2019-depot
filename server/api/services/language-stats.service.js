const userRepository = require('../../data/repositories/user.repository');
const repoRepository = require('../../data/repositories/repository.repository');
const branchRepository = require('../../data/repositories/branch.repository');
const languageStatsRepository = require('../../data/repositories/language-stats.repository');
const languageRepository = require('../../data/repositories/language.repository');

const getBranchId = async (reponame, owner, branch) => {
  const { id: userId } = await userRepository.getByUsername(owner);
  const { id: repoId } = await repoRepository.getByUserAndReponame(userId, reponame);
  const { id: branchId } = await branchRepository.getByNameAndRepoId(branch, repoId);
  return branchId;
};

const getStatsByBranch = async (repoId, branch) => {
  const { id: branchId } = await branchRepository.getByNameAndRepoId(branch, repoId);
  return languageStatsRepository.getByBranchId(branchId);
};

const upsertStats = async (langStats, reponame, owner, branch) => {
  const branchId = await getBranchId(reponame, owner, branch);
  await languageStatsRepository.deleteByBranchId(branchId);
  return Promise.all(
    langStats.map(([langName, percentage]) => languageRepository
      .getByName(langName)
      .then(({ id: languageId }) => languageStatsRepository.upsertStats(branchId, languageId, { branchId, languageId, percentage })))
  );
};

const deleteStats = async (reponame, owner, branch) => {
  const branchId = await getBranchId(reponame, owner, branch);
  return languageStatsRepository.deleteByBranchId(branchId);
};

module.exports = { getStatsByBranch, upsertStats, deleteStats };
