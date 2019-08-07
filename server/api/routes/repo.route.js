const { Router } = require('express');

const {createRepo} = require('../services/repo.service')

const router = Router();

router.post('/', (req, res, next) => {
  createRepo({...req.body})
    .then(data => res.send(data))
});

module.exports = router;