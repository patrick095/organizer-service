/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
    moduleNameMapper: {
        '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^@entity/(.*)$': '<rootDir>/src/entity/$1',
        '^@configs/(.*)$': '<rootDir>/src/configs/$1',
        '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
        '^@repository/(.*)$': '<rootDir>/src/repository/$1',
        '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
        '^@routers/(.*)$': '<rootDir>/src/routers/$1',
    },
    modulePathIgnorePatterns: ['<rootDir>/__tests__/helpers'],
    coverageReporters: ['json-summary', 'html'],
};
