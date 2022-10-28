module.exports = {
    roots: [
        "."
    ],
    testMatch: [
        "**/test/**/*.ts",
    ],
    transform: {
        "^.+\\.ts$": "ts-jest"
    },
    transformIgnorePatterns: [],
    preset: 'ts-jest/presets/js-with-ts-esm',
}