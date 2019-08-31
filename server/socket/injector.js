const issuesSocketInjector = issuesNsp => (req, res, next) => {
  req.issuesNsp = issuesNsp;
  next();
};
const commitsSocketInjector = commitsNsp => (req, res, next) => {
  req.commitsNsp = commitsNsp;
  next();
};

module.exports = { issuesSocketInjector, commitsSocketInjector };
