const orm = require('../db/connection');
const associate = require('../db/associations');

const User = orm.import('./user');
const SshKey = orm.import('./sshkey');
const Repository = orm.import('./repository');
const Branch = orm.import('./branch');
const Commit = orm.import('./commit');
const CommitComment = orm.import('./commitcomment');
const Issue = orm.import('./issue');
const IssueComment = orm.import('./issueComment');
const Star = orm.import('./star');
const OrgUser = orm.import('./orgUser');
const Role = orm.import('./role');
const Permission = orm.import('./permission');
const Collaborator = orm.import('./collaborator');
const Language = orm.import('./language');
const LanguageStats = orm.import('./languageStats');
const Label = orm.import('./label');
const PullRequest = orm.import('./pullrequest');
const PRStatus = orm.import('./prstatus');
const PullComment = orm.import('./pullComment');
const PinnedRepository = orm.import('./pinnedRepository');
const IssueLabel = orm.import('./issueLabel');
const PullReviewer = orm.import('./pullReviewer');
const ReviewStatus = orm.import('./reviewStatus');
const PullLabel = orm.import('./pullLabel');
const IssueAssignee = orm.import('./issueAssignee');

associate({
  User,
  SshKey,
  Repository,
  Branch,
  Commit,
  CommitComment,
  Issue,
  IssueComment,
  Star,
  OrgUser,
  Role,
  Permission,
  Collaborator,
  Language,
  LanguageStats,
  Label,
  PullRequest,
  PRStatus,
  PullComment,
  PinnedRepository,
  IssueLabel,
  PullReviewer,
  ReviewStatus,
  PullLabel,
  IssueAssignee
});

module.exports = {
  UserModel: User,
  SshKeyModel: SshKey,
  RepositoryModel: Repository,
  BranchModel: Branch,
  CommitModel: Commit,
  CommitCommentModel: CommitComment,
  IssueModel: Issue,
  IssueCommentModel: IssueComment,
  StarModel: Star,
  OrgUserModel: OrgUser,
  RoleModel: Role,
  PermissionModel: Permission,
  CollaboratorModel: Collaborator,
  LanguageModel: Language,
  LanguageStatsModel: LanguageStats,
  LabelModel: Label,
  PullRequestModel: PullRequest,
  PRStatusModel: PRStatus,
  PullCommentModel: PullComment,
  PinnedRepositoryModel: PinnedRepository,
  IssueLabelModel: IssueLabel,
  PullReviewerModel: PullReviewer,
  ReviewStatusModel: ReviewStatus,
  PullLabelModel: PullLabel,
  IssueAssigneeModel: IssueAssignee
};
