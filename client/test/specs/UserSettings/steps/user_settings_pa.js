const SettingsPages = require('../pages/user_settings_po');

class SettingsSteps {
  fillUpUserProfile(info) {
    //here waitForDisplayed of whole form - container for all the inputs
    this.enterName(info.profileSettings.name);
    this.enterBio(info.profileSettings.bio);
    this.enterUrl(info.profileSettings.url);
    this.enterCompany(info.profileSettings.company);
    this.enterLocation(info.profileSettings.location);
  }

  enterName(name) {
    //delete this wait, cuz we'll wait for whole form
    SettingsPages.nameInput.waitForDisplayed(2000);
    SettingsPages.nameInput.clearValue();
    SettingsPages.nameInput.setValue(name);
  }

  enterBio(bio) {
    SettingsPages.urlInput.clearValue();
    SettingsPages.bioInput.setValue(bio);
  }

  enterUrl(url) {
    SettingsPages.urlInput.clearValue();
    SettingsPages.urlInput.setValue(url);
  }

  enterCompany(company) {
    SettingsPages.companyInput.clearValue();
    SettingsPages.companyInput.setValue(company);
  }

  enterLocation(location) {
    SettingsPages.locationInput.clearValue();
    SettingsPages.locationInput.setValue(location);
  }

  updateProfileBtn() {
    //always wait to be displayed etc
    SettingsPages.updateProfileButton.click();
  }

  navigateToProfileSettings() {
    browser.pause(500);
    SettingsPages.profileDropDownMenu.click();
    SettingsPages.navigateToSettings.waitForDisplayed(2000);
    SettingsPages.navigateToSettings.click();
  }

  navigateToSSHkeys() {
    SettingsPages.sshKeys.waitForDisplayed(2000);
    SettingsPages.sshKeys.click();
  }

  navigateToOrganizations() {
    SettingsPages.organizations.waitForDisplayed(2000);
    SettingsPages.organizations.click();
  }

  navigateToYourProfile() {
    browser.pause(500);
    SettingsPages.profileDropDownMenu.waitForDisplayed(2000);
    SettingsPages.profileDropDownMenu.click();
    SettingsPages.yourProfile.waitForDisplayed(2000);
    SettingsPages.yourProfile.click();
    browser.pause(500);
  }
}

module.exports = new SettingsSteps();
