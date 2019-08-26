const { Router } = require('express');
const { createKey, deleteKey } = require('../services/ssh-key.service');

const router = Router();

router.post('/', (req, res, next) => {
  createKey({ ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  deleteKey(id)
    .then(() => res.sendStatus(200))
    .catch(next);
});

module.exports = router;
