const now = new Date();

const starsSeed = new Array(50).fill(true).map(() => ({
  createdAt: now,
  updatedAt: now
}));

module.exports = starsSeed;
