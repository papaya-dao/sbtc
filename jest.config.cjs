module.exports = {
  moduleFileExtensions: [
    "js",
    "ts"
  ],
  moduleDirectories: [
    "node_modules",
    "src"
  ],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.(ts|tsx)?$": "ts-jest"
  },

  transformIgnorePatterns: [
    '/node_modules/(?!(@scure|micro-packed)/)',
  ]
}