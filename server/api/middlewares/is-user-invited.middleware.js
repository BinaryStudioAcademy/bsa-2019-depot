const CustomError = require('../../helpers/error.helper');

module.exports = async (req, res, next) => (req.body.userId === req.user.id
  ? next()
  : next(new CustomError(403, `User ${req.user.username} doesn't have permission to access this page`)));
