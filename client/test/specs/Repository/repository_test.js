const help = require('../../helpers/helpers.js');
const repoSteps = require('../Repository/steps/repository_pa.js');
const menuSteps = require('../DropdownMenu/steps/menu_pa.js');
const credentials = require('../credentials');
const assert = require('assert');

describe('Repositories  ', () => {
  beforeEach(() => {
    help.loginWithDefaultUser();
  });

  afterEach(() => {
    browser.reloadSession();
  });

  it('should create repository', () => {
    menuSteps.navigateToNewRepository();
    repoSteps.enterRepoName(credentials.repo.repoName);
    repoSteps.enterDescription(credentials.repo.repoDescription);
    repoSteps.selectReadme();
    repoSteps.addGitignore();
    repoSteps.addLicense();
    repoSteps.submitCreateRepoBtn();
    assert.strict(credentials.repo.repoName, repoSteps.createdRepoName());
    //postconditions
    repoSteps.navigateToRepoSettings();
    repoSteps.deleteRepo();
  });

  it('should create new file in repository', () => {
    menuSteps.navigateToNewRepository();
    repoSteps.enterRepoName(credentials.repo.repoName);
    repoSteps.enterDescription(credentials.repo.repoDescription);
    repoSteps.selectReadme();
    repoSteps.addGitignore();
    repoSteps.addLicense();
    repoSteps.submitCreateRepoBtn();
    repoSteps.createNewFileBtn();
    repoSteps.enterNewFileName(credentials.newFileName);
    repoSteps.enterCommitMessage(credentials.commitMessage);
    repoSteps.submitCommit();
    assert.strict(credentials.newFileName, repoSteps.createdFileName());
    //postconditions
    repoSteps.navigateToRepoSettings();
    repoSteps.deleteRepo();
  });
});
