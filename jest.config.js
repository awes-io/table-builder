module.exports = {
    moduleFileExtensions: [
        "js",
        "vue"
    ],
    transform: {
        ".*\\.(vue)$": "vue-jest",
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
    },
    setupFiles: [
        "<rootDir>/jest.init.js"
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        "<rootDir>/resources/vue/*.{js,vue}",
    ],
    coverageReporters: ["html", "text-summary"]
} 