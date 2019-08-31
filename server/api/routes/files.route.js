const { Router } = require('express');
const filesService = require('../services/files.service');

const router = Router();

router.get('/', (req, res, next) => {
  const {
    owner, reponame, branch, path, token
  } = req.query;
  filesService
    .getRawFileContent(owner, reponame, branch, path, token)
    .then(({ content }) => res.send(content))
    .catch(next);
});

module.exports = router;
