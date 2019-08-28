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

  submitCreateRepoBtn() {
    repoPage.createRepoBtn.click();
    browser.pause(500);
  }

  createdRepoName() {
    repoPage.createdRepoName.getText();
  }

  navigateToRepoSettings() {
    repoPage.repoSettings.waitForDisplayed(2000);
    repoPage.repoSettings.click();
  }

  deleteRepo() {
    repoPage.deleteBtn.waitForDisplayed(2000);
    repoPage.deleteBtn.click();
    browser.pause(500);
  }

  createNewFileBtn() {
    repoPage.createNewFileBtn.waitForDisplayed(2000);
    repoPage.createNewFileBtn.click();
  }

  enterNewFileName(fileName) {
    repoPage.newFileNameInput.clearValue();
    repoPage.newFileNameInput.setValue(fileName);
  }

  enterCommitMessage(commitMessage) {
    repoPage.commitMessageInput.clearValue();
    repoPage.commitMessageInput.setValue(commitMessage);
  }

  submitCommit() {
    repoPage.commitFileBtn.scrollIntoView();
    repoPage.commitFileBtn.click();
    browser.pause(500);
  }

  createdFileName() {
    repoPage.createdFileName.getText();
  }
}

module.exports = new RepoSteps();
