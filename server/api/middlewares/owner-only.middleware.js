module.exports = (req, res, next) => {
  const { username } = req.user;
  const { owner } = req.params;

  if (username !== owner) {
    next({ status: 401, message: 'Only owner allowed.' }, null);
  } else {
    next();
  }
};
