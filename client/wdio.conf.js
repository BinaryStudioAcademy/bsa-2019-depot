const path = require('path');
const fs = require('fs');
const ROOT_DIR = path.resolve(__dirname);
const TEST_DIR = path.join(ROOT_DIR, 'test');
const SPECS_DIR = path.join(TEST_DIR, 'specs');
const OUTPUT_DIR = path.join(TEST_DIR, 'output');
const SCREENSHOT_DIR = path.join(OUTPUT_DIR, 'screenshotsFail');
const testPattern = path.relative(ROOT_DIR, path.join(SPECS_DIR, '**', '*_test.js'));

exports.config = {
  runner: 'local',
  //
  // Override default path ('/wd/hub') for chromedriver service.
  path: '/',
  host: 'localhost',
  port: 4444,
  outputDir: OUTPUT_DIR,
  specs: [testPattern],
  suites: {
    //login: [testPattern]
  },
  //sync: false,
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],
  maxInstances: 1,
  capabilities: [
    {
      maxInstances: 1,
      browserName: 'chrome'
    }
  ],
  logLevel: 'trace',
  bail: 0,
  baseUrl: '',
  waitforTimeout: 90000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['chromedriver'],
  chromeDriverLogs: path.join(OUTPUT_DIR, 'ch-driver.log'),
  framework: 'mocha',
  reporters: ['spec', 'junit'],
  reportersOptions: {
    junit: {
      outputDir: path.join(OUTPUT_DIR, 'test_result'),
      errorOptions: {
        error: 'message',
        failure: 'message',
        stacktrace: 'stack'
      }
    }
  },
  coloredLogs: true,
  screenshotPath: path.join(OUTPUT_DIR, 'screenshots'),
  //
  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: 'bdd',
    timeout: 90000
  },
  onPrepare: function(config, capabilities) {
    require('./clearSettingsData.js')();
  },
  afterTest: function(test) {
    if (test.passed) {
      return;
    }
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR);
    }
    const filename = encodeURIComponent(test.title.replace(/\s+/g, '-'));
    const filePath = SCREENSHOT_DIR + `/${filename}.png`;
    browser.saveScreenshot(filePath);
  }
};
