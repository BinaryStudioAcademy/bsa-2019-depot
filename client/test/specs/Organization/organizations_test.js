const help = require('../../helpers/helpers');
const menuSteps = require('../DropdownMenu/steps/menu_pa');
const credentials = require('../credentials.json');
const OrgSteps = require('../Organization/steps/organization_pa');
const assert = require('assert');

describe('Organizations  ', () => {
  beforeEach(() => {
    help.loginWithDefaultUser();
  });

  afterEach(() => {
    browser.reloadSession();
  });

  it('should create organization', () => {
    menuSteps.navigateToNewOrganization();
    OrgSteps.enternameofneworg(credentials.org.neworgname);
    OrgSteps.enteremailofneworg(credentials.org.neworgemail);
    OrgSteps.saveneworgbutton();
    assert.strict(credentials.org.neworgname, OrgSteps.createdNewOrgName());
  });

  it('should create repository in organization', () => {
    menuSteps.navigateToNewOrganization();
    OrgSteps.enternameofneworg(credentials.org.neworgname1);
    OrgSteps.enteremailofneworg(credentials.org.neworgemail1);
    OrgSteps.saveneworgbutton();
    OrgSteps.newrepofororgbutton();
    OrgSteps.enterereponame(credentials.org.orgreponame);
    OrgSteps.createrepofororgbutton();
    assert.strict(credentials.org.orgreponame, OrgSteps.createdRepoofOrg());
  });
});
