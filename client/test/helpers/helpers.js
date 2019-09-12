const LoginSteps = require('../specs/Login/steps/login_pa');
const credentials = require('../specs/credentials');
const wait = require('../helpers/waiters');

class HelpClass {
  loginWithDefaultUser() {
    browser.maximizeWindow();
    browser.url('https://stage.depothub.xyz/login');
    LoginSteps.submitLoginForm(credentials.login.email, credentials.login.password);
    wait.forSpinner();
  }
}

module.exports = new HelpClass();
