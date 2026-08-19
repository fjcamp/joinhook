const playwright = require('playwright');
const originalLaunch = playwright.chromium.launch.bind(playwright.chromium);
playwright.chromium.launch = (options = {}) => originalLaunch({ ...options, executablePath: process.env.CHROME_BIN });
require('./browser-qa.js');
