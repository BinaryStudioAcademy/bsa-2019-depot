const { Router } = require('express');
const searchService = require('../services/search.service');

const router = Router();

router.get('/', (req, res, next) => {
  const { input } = req.query;
  searchService
    .find(input)
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;
