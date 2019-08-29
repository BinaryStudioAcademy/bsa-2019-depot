const socketInjector = issuesNsp => (req, res, next) => {
  req.issuesNsp = issuesNsp;
  next();
};

module.exports = socketInjector;
