const issuesSocketInjector = issuesNsp => (req, res, next) => {
  req.issuesNsp = issuesNsp;
  next();
};
const commitsSocketInjector = commitsNsp => (req, res, next) => {
  req.commitsNsp = commitsNsp;
  next();
};
const reposSocketInjector = reposNsp => (req, res, next) => {
  req.reposNsp = reposNsp;
  next();
};

module.exports = { issuesSocketInjector, commitsSocketInjector, reposSocketInjector };
