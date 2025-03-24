module.exports = {
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx'
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
    '<rootDir>/build/',
    '<rootDir>/dist/'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(ol|@camptocamp/inkmap|@terrestris/*[a-z]*-util|d3-selection|color-*[a-z]*)|(rc-*[a-z]*)|' +
    'filter-obj|query-string|decode-uri-component|split-on-first|shpjs/|rbush|quickselect|geostyler-openlayers-parser|' +
    'geostyler-style|geotiff|quick-lru|quickselect)'
  ],
  setupFiles: [
    '<rootDir>/jest/__mocks__/matchMediaMock.js'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest/setup.js'
  ],
  transform: {
    '^.+\\.jsx?$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.tsx?$': '<rootDir>/node_modules/babel-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*example*.*'
  ],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  }
};
