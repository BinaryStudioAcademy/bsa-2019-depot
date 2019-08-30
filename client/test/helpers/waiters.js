class Waiter {
  forSpinner() {
    const spinner = $('div.ui.massive.inverted.loader');
    spinner.waitForDisplayed(2000);
    spinner.waitForDisplayed(5000, true);
  }

  forFileTreeSpinner() {
    const spinnerF = $('div.ui.active.loader');
    spinnerF.waitForDisplayed(1000);
    spinnerF.waitForDisplayed(5000, true);
  }
}

module.exports = new Waiter();
