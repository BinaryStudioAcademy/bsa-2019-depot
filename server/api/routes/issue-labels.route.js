const { Router } = require('express');
const { addIssueLabel, deleteIssueLabelById, getIssueLabelById } = require('../services/issue-label.service');

const router = Router();

router.get('/:issueLabelId', (req, res, next) => {
  const { issueLabelId } = req.params;
  getIssueLabelById(issueLabelId)
    .then(issueLabel => res.send(issueLabel))
    .catch(next);
});

router.post('/', (req, res, next) => {
  addIssueLabel({ ...req.body })
    .then(issueLabel => res.send(issueLabel))
    .catch(next);
});

router.delete('/:issueLabelId', (req, res, next) => {
  const { issueLabelId } = req.params;
  deleteIssueLabelById(issueLabelId)
    .then(() => res.send({ id: issueLabelId }))
    .catch(next);
});

module.exports = router;
