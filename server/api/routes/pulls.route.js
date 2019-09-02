const { Router } = require('express');
const pullService = require('../services/pulls.service');

const router = Router();

router.post('/', (req, res, next) => {
  pullService
    .addPull({ ...req.body })
    .then(data => res.send({ data }))
    .catch(next);
});

module.exports = router;
