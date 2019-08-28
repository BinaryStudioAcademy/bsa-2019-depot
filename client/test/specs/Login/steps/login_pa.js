const LoginPage = require('../page/login_po');

class LoginSteps {
  submitLoginForm(email, password) {
    LoginPage.emailInput.waitForDisplayed(2000);
    LoginPage.emailInput.setValue(email);
    LoginPage.passwordInput.setValue(password);
    LoginPage.signInBtn.click();
  }
}

module.exports = new LoginSteps();
