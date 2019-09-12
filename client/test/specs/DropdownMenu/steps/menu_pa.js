const MenuPage = require('../page/menu_po');

class MenuSteps {
  moveToMenu() {
    MenuPage.plusMenu.click();
  }

  navigateToNewRepository() {
    this.moveToMenu();
    MenuPage.newRepositoryLink.waitForDisplayed(2000);
    MenuPage.newRepositoryLink.click();
  }
  navigateToNewOrganization() {
    this.moveToMenu();
    MenuPage.newOrganizationLink.waitForDisplayed(2000);
    MenuPage.newOrganizationLink.click();
  }
}

module.exports = new MenuSteps();
