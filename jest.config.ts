/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/integrations/**/*.[jt]s?(x)'],
    testTimeout: 1000,
    verbose: true,
}
