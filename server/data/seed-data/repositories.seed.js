const now = new Date();

const reposSeed = [
  {
    name: 'test_repo',
    url: 'http://localhost:3001/test_user/test_repo/settings',
    isPublic: true,
  },
  {
    name: 'test1_repo',
    url: 'http://localhost:3001/user1/test_repo/settings',
    isPublic: true,
  }
].map(repo => ({
  ...repo,
  createdAt: now,
  updatedAt: now
}));

module.exports = reposSeed;
