const help = require('../../helpers/helpers.js');
const repoSteps = require('../Repository/steps/repository_pa.js');
const menuSteps = require('../DropdownMenu/steps/menu_pa.js');
const credentials = require('../credentials');
const assert = require('assert');
const repoPage = require('./page/repository_po');
const wait = require('../../helpers/waiters');

describe('Repositories  ', () => {
  beforeEach(() => {
    help.loginWithDefaultUser();
  });

  afterEach(() => {
    repoSteps.navigateToRepoSettings();
    repoSteps.deleteRepo();
    browser.reloadSession();
  });

  it('should create repository', () => {
    menuSteps.navigateToNewRepository();
    wait.forSpinner();
    repoSteps.enterRepoName(credentials.repo.repoName1);
    repoSteps.enterDescription(credentials.repo.repoDescription);
    repoSteps.selectReadme();
    repoSteps.addGitignore();
    repoSteps.addLicense();
    repoSteps.submitCreateRepoForm();
    assert.strictEqual(credentials.repo.repoName1, repoPage.createdRepoName.getText());
  });

  it('should create new file in repository', () => {
    menuSteps.navigateToNewRepository();
    wait.forSpinner();
    repoSteps.enterRepoName(credentials.repo.repoName2);
    repoSteps.enterDescription(credentials.repo.repoDescription);
    repoSteps.selectReadme();
    repoSteps.addGitignore();
    repoSteps.addLicense();
    repoSteps.submitCreateRepoForm();
    repoSteps.createNewFileBtn();
    repoSteps.enterNewFileName(credentials.newFileName);
    repoSteps.enterCommitMessage(credentials.commitMessage);
    repoSteps.submitCommit();
    assert.strictEqual(credentials.newFileName2, repoSteps.getFileName());
  });
});
