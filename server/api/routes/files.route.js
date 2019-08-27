const { Router } = require('express');
const filesService = require('../services/files.service');

const router = Router();

router
  .get('/', (req, res, next) => {
    const {
      owner, reponame, branch, path
    } = req.query;
    filesService.getFileContent(owner, reponame, branch, path)
      .then(({ content }) => res.send(content))
      .catch(next);
  });

module.exports = router;
