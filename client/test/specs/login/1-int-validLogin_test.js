const assert = require('assert');

describe('Login test suite', () => {
  it('should login', async () => {
    //basic webdriver test
    await browser.url('https://webdriver.io');
    const title = await browser.getTitle();
    assert.strictEqual(title, 'WebdriverIO · Next-gen WebDriver test framework for Node.js');
  });
});
