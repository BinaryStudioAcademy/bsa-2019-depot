const help = require('../../helpers/helpers');
const profileSteps = require('./steps/user_settings_pa');
const credentials = require('../credentials');
const assert = require('assert');
const profileObj = require('./pages/user_settings_po');

describe('Settings', () => {
  beforeEach(() => {
    help.loginWithDefaultUser();
  });

  afterEach(() => {
    browser.reloadSession();
  });

  it('should change user public information', () => {
    profileSteps.navigateToProfileSettings();
    profileSteps.fillUpUserProfile(credentials);
    profileSteps.updateProfile();
    profileSteps.navigateToYourProfile();

    assert.strictEqual(credentials.profileSettings.name, profileObj.updatedName.getText());
    assert.strictEqual(credentials.profileSettings.bio, profileObj.updatedBio.getText());
    assert.strictEqual(credentials.profileSettings.location, profileObj.updatedLocation.getText());
    assert.strictEqual(credentials.profileSettings.url, profileObj.updatedUrl.getText());
    assert.strictEqual(credentials.profileSettings.company, profileObj.updatedCompany.getText());
  });
});
