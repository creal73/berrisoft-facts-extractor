module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [    
    "src/extractor.ts",
    "!**/node_modules/**",
    "!**/vendor/**"
  ]
};