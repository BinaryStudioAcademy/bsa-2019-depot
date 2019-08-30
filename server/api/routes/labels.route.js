const { Router } = require('express');
const {
  createLabel, updateLabelById, deleteLabelById, getLabelById
} = require('../services/label.service');

const router = Router();

router.get('/:labelId', (req, res, next) => {
  const { labelId } = req.params;
  getLabelById(labelId)
    .then(label => res.send(label))
    .catch(next);
});

router.post('/', (req, res, next) => {
  createLabel({ ...req.body })
    .then(label => res.send(label))
    .catch(next);
});

router.put('/', (req, res, next) => {
  const { id } = req.body;
  updateLabelById(id, { ...req.body })
    .then((label) => {
      res.send(label);
    })
    .catch(next);
});

router.delete('/:labelId', (req, res, next) => {
  const { labelId } = req.params;
  deleteLabelById(labelId)
    .then(() => res.send({ id: labelId }))
    .catch(next);
});

module.exports = router;
