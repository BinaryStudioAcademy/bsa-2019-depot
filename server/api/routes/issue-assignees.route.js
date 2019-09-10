const { Router } = require('express');
const {
  setIssueAssignees,
  deleteIssueAssigneeById,
  getIssueAssigneeById
} = require('../services/issue-assignee.service');

const router = Router();

router.get('/:issueAssigneeId', (req, res, next) => {
  const { issueAssigneeId } = req.params;
  getIssueAssigneeById(issueAssigneeId)
    .then(issueAssignee => res.send(issueAssignee))
    .catch(next);
});

router.post('/', (req, res, next) => {
  const { assigneeNames, issueId } = req.body;
  setIssueAssignees(assigneeNames, issueId)
    .then(issueAssignees => res.send(issueAssignees))
    .catch(next);
});

router.delete('/:issueAssigneeId', (req, res, next) => {
  const { issueAssigneeId } = req.params;
  deleteIssueAssigneeById(issueAssigneeId)
    .then(() => res.send({ id: issueAssigneeId }))
    .catch(next);
});

module.exports = router;
