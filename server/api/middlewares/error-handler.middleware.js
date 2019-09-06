module.exports = (err, req, res, next) => {
  console.log(err);
  if (res.headersSent) {
    next(err);
  } else {
    const { status = 500, message = '' } = err;
    res.status(status).send({ status, message });
  }
};
