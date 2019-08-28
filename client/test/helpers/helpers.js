const LoginSteps = require('../specs/Login/steps/login_pa');
const credentials = require('../specs/credentials');

class HelpClass {
  loginWithDefaultUser() {
    browser.maximizeWindow();
    browser.url('https://stage.depothub.xyz/login');
    LoginSteps.submitLoginForm(credentials.login.email, credentials.login.password);
  }
}

module.exports = new HelpClass();
