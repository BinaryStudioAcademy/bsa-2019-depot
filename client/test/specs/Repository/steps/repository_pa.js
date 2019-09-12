const repoPage = require('../page/repository_po');

class RepoSteps {
  enterRepoName(reponame) {
    repoPage.repoNameInput.waitForDisplayed(2000);
    repoPage.repoNameInput.clearValue();
    repoPage.repoNameInput.setValue(reponame);
  }

  enterDescription(description) {
    repoPage.repoDescriptionInput.clearValue();
    repoPage.repoDescriptionInput.setValue(description);
  }

  selectReadme() {
    repoPage.readme.click();
  }

  addGitignore() {
    repoPage.gitignoreDropdownMenu.click();
    repoPage.selectGitignore.waitForDisplayed(2000);
    repoPage.selectGitignore.click();
  }

  addLicense() {
    repoPage.licenseDropdownMenu.click();
    repoPage.selectLicense.waitForDisplayed(2000);
    repoPage.selectLicense.click();
  }

  submitCreateRepoForm() {
    repoPage.createRepoBtn.click();
    browser.pause(500);
  }

  navigateToRepoSettings() {
    repoPage.repoSettings.waitForDisplayed(2000);
    repoPage.repoSettings.click();
  }

  deleteRepo() {
    browser.pause(500);
    repoPage.deleteBtn.click();
  }

  createNewFileBtn() {
    repoPage.createNewFileBtn.scrollIntoView();
    repoPage.createNewFileBtn.click();
  }

  enterNewFileName(fileName) {
    repoPage.newFileNameInput.clearValue();
    repoPage.newFileNameInput.setValue(fileName);
  }

  enterCommitMessage(commitMessage) {
    repoPage.commitMessageInput.clearValue();
    repoPage.commitMessageInput.scrollIntoView();
    repoPage.commitMessageInput.setValue(commitMessage);
  }

  submitCommit() {
    repoPage.commitFileBtn.scrollIntoView();
    repoPage.commitFileBtn.waitForDisplayed(2000);
    repoPage.commitFileBtn.click();
    browser.pause(750);
  }
  getFileName() {
    browser.pause(750);
    repoPage.createdFileName.getText();
  }
}

module.exports = new RepoSteps();
