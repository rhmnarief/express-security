module.exports = {
  globalSetup: './test/global.js',
  verbose: true,
  reporters: ['default', 'jest-html-reporters'], 
  testMatch: [
    "<rootDir>/test/**/*.(test).{js,jsx,ts,tsx}",
    "<rootDir>/test/**/?(*.)(spec|test).{js,jsx,ts,tsx}"
  ],
};
