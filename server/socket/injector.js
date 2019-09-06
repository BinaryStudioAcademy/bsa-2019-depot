const issuesSocketInjector = issuesNsp => (req, res, next) => {
  req.issuesNsp = issuesNsp;
  next();
};
const pullsSocketInjector = pullsNsp => (req, res, next) => {
  req.pullsNsp = pullsNsp;
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

module.exports = {
  issuesSocketInjector, pullsSocketInjector, commitsSocketInjector, reposSocketInjector
};
