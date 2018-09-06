module.exports = {
  testURL: 'http://localhost/',
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
    // Uncomment the following line if you're working with a linked
    // @terrestris/ol-util package (or any other package that requires ol
    // itself).
    // "^ol/(.*)": '<rootDir>/node_modules/ol/$1'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/build/'
  ],
  transformIgnorePatterns: [
     'node_modules/(?!(ol|@terrestris/*|antd|(rc-*[a-z]*)|css-animation)/)'
  ],
  setupFiles: [
    '<rootDir>/jest/__mocks__/shim.js',
    '<rootDir>/jest/setup.js'
  ],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.jsx',
    'src/**/*.js',
    '!src/**/*example*.*'
  ],
  coverageDirectory: '<rootDir>/coverage'
};
