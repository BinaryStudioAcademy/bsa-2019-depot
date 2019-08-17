const getName = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, '')
  .substr(0, 5);
const now = new Date();
const repositoriesSeed = new Array(50).fill({
  name: getName(),
  createdAt: now,
  updatedAt: now
});

module.exports = repositoriesSeed;
