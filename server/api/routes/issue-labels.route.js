const { Router } = require('express');
const { setIssueLabels, deleteIssueLabelById, getIssueLabelById } = require('../services/issue-label.service');

const router = Router();

router.get('/:issueLabelId', (req, res, next) => {
  const { issueLabelId } = req.params;
  getIssueLabelById(issueLabelId)
    .then(issueLabel => res.send(issueLabel))
    .catch(next);
});

router.post('/', (req, res, next) => {
  const { labelIds, issueId } = req.body;
  setIssueLabels(labelIds, issueId)
    .then(issueLabels => res.send(issueLabels))
    .catch(next);
});

router.delete('/:issueLabelId', (req, res, next) => {
  const { issueLabelId } = req.params;
  deleteIssueLabelById(issueLabelId)
    .then(() => res.send({ id: issueLabelId }))
    .catch(next);
});

module.exports = router;
