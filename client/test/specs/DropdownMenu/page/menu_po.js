class MenuPage {
  get plusMenu() {
    return $('div.dropdown i.plus.icon');
  }
  get newRepositoryLink() {
    return $('a[href="/new"]');
  }
  get newOrganizationLink() {
    return $('a[href="/organizations/new"]');
  }
}

module.exports = new MenuPage();
