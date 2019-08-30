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
const Language = orm.import('./language');
const LanguageStats = orm.import('./languageStats');
const Label = orm.import('./label');

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
  Language,
  LanguageStats,
  Label
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
  LanguageModel: Language,
  LanguageStatsModel: LanguageStats,
  LabelModel: Label
};
