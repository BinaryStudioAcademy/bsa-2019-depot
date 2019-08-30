const orgPage = require('../page/organization_po');

class OrgSteps {
  enternameofneworg(value) {
    orgPage.orgnameField.waitForExist(5000);
    orgPage.orgnameField.clearValue();
    orgPage.orgnameField.setValue(value);
  }

  enteremailofneworg(value) {
    orgPage.orgemailField.waitForExist(5000);
    orgPage.orgemailField.clearValue();
    orgPage.orgemailField.setValue(value);
  }

  saveneworgbutton() {
    orgPage.savebutton.waitForEnabled(5000);
    orgPage.savebutton.click();
  }

  createdNewOrgName() {
    orgPage.createdNewOrgName.getText();
  }

  newrepofororgbutton() {
    orgPage.newrepofororgbutton.waitForEnabled(5000);
    orgPage.newrepofororgbutton.click();
  }

  enterereponame(value) {
    orgPage.orgrepoField.waitForExist(5000);
    orgPage.orgrepoField.clearValue();
    orgPage.orgrepoField.setValue(value);
  }

  createrepofororgbutton() {
    orgPage.createrepofororgbutton.waitForEnabled(5000);
    orgPage.createrepofororgbutton.click();
  }

  createdRepoofOrg() {
    orgPage.createdRepoofOrg.getText();
  }
}

module.exports = new OrgSteps();
