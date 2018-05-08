module.exports = {
  moduleFileExtensions: [
    'js',
    'jsx'
  ],
  moduleDirectories: [
    'node_modules'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/jest/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/jest/__mocks__/styleMock.js'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/build/'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!ol)'
  ],
  setupFiles: [
    '<rootDir>/jest/__mocks__/shim.js',
    '<rootDir>/jest/setup.js'
  ],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.jsx'
  ],
  coverageDirectory: '<rootDir>/coverage'
};
