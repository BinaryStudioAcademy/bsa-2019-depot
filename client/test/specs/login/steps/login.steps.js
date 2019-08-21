const loginPage = require('../pages/login.po');

class LoginSteps {
  submitLoginForm(email, password) {
    loginPage.emailInput.sendKeys(email);
    loginPage.passwordInput.sendKeys(password);
    loginPage.submitBtn.click();
  }
}

module.exports = new LoginSteps();
