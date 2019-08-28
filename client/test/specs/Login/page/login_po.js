class LoginPage {
  get emailInput() {
    return $('input[name=email]');
  }
  get passwordInput() {
    return $('input[type=password]');
  }
  get signInBtn() {
    return $('button[type=submit]');
  }
}

module.exports = new LoginPage();
