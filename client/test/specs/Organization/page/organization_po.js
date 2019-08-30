class orgPage {
  get orgnameField() {
    return $('input[name=username]');
  }
  get orgemailField() {
    return $('input[name=email]');
  }
  get savebutton() {
    return $('button[type=submit]');
  }
  get createdNewOrgName() {
    return $('div.styles_orgName__3UrG2');
  }
  get newrepofororgbutton() {
    return $('button.ui.primary.button.styles_new_repo__1ElZC');
  }
  get orgrepoField() {
    return $('input[name=reponame]');
  }
  get createrepofororgbutton() {
    return $('button[type=submit]');
  }
  get createdRepoofOrg() {
    return $('div.styles_repoName__2MxS1 > span > a:nth-child(3)');
  }
}

module.exports = new orgPage();
