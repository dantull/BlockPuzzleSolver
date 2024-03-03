/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    "(.+)\\.js": "$1",
  },
  roots: ["./src"],
  testEnvironment: 'node',
};