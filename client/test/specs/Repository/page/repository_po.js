class RepoPage {
  get repoNameInput() {
    return $('input[name="reponame"]');
  }
  get repoDescriptionInput() {
    return $('input[name="description"]');
  }
  get readme() {
    return $$('div.ui.checkbox label')[2];
  }
  get gitignoreDropdownMenu() {
    return $$('div.ui.selection.dropdown')[0];
  }
  get selectGitignore() {
    return $$('div#gitignore.item')[1];
  }
  get licenseDropdownMenu() {
    return $$('div.ui.selection.dropdown')[1];
  }
  get selectLicense() {
    return $$('div#license')[1];
  }
  get createRepoBtn() {
    return $('button[type="submit"]');
  }
  get createdRepoName() {
    return $$('span.styles_repoPath__3Ye3J a')[1];
  }
  get repoSettings() {
    return $$('div.false a')[3];
  }
  get deleteBtn() {
    return $$('button[type=button]')[1];
  }
  get createNewFileBtn() {
    return $('div.styles_repoActions__3UqWR button');
  }
  get newFileNameInput() {
    return $('div.styles_fileNameInput__1baIY input');
  }
  get commitMessageInput() {
    return $('div.ui.fluid input');
  }
  get commitFileBtn() {
    return $('div button[type="submit"]');
  }
  get createdFileName() {
    return $$('tbody tr td a.styles_link__2E3TI')[6];
  }
}

module.exports = new RepoPage();
