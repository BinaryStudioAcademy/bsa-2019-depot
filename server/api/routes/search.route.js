const { Router } = require('express');
const searchService = require('../services/search.service');

const router = Router();

router.get('/', (req, res, next) => {
  const { user, repo } = req.query;
  searchService
    .find(user, repo)
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;
