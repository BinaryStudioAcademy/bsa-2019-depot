class SettingsPage {
  get profileDropDownMenu() {
    return $$('div[role=listbox]')[1];
  }
  get navigateToSettings() {
    return $('div.menu a[href="/settings/profile"]');
  }
  get sshKeys() {
    return $('div.divider a[href="/settings/keys"]');
  }
  get organizations() {
    return $('a[href="/settings/organizations"]');
  }
  get nameInput() {
    return $('div input[name=name]');
  }
  get bioInput() {
    return $('textarea[name=bio]');
  }
  get urlInput() {
    return $('input[name=url]');
  }
  get companyInput() {
    return $('input[name=company]');
  }
  get locationInput() {
    return $('input[name=location]');
  }
  get updateProfileButton() {
    return $('button.blue');
  }
  get editPictureButton() {
    return $('button.tiny.compact');
  }
  get yourProfile() {
    return $$('div.menu a.item')[3];
  }

  get updatedName() {
    return $('div > h1 > span.styles_fullname__2ObTu span');
  }
  get updatedBio() {
    return $('div.styles_additionInfo__2xvt1 div');
  }
  get updatedLocation() {
    return $$('.styles_additionInfoItem__18MOZ span')[1];
  }
  get updatedUrl() {
    return $('li.styles_additionInfoItem__18MOZ a');
  }
  get updatedCompany() {
    return $$('.styles_additionInfoItem__18MOZ span')[0];
  }
}

module.exports = new SettingsPage();
