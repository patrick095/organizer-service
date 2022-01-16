module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: [
        'airbnb-base',
        'airbnb-typescript/base',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.eslint.json',
    },
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        'import/prefer-default-export': 'off',
        semi: ['error', 'always'],
        indent: 'off',
        '@typescript-eslint/indent': ['error', 4],
        'no-unused-vars': 'off',
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'off',
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'class-methods-use-this': 'off',
        'max-len': 'off',
        'no-underscore-dangle': 'off',
        'lines-between-class-members': 'off',
        '@typescript-eslint/lines-between-class-members': 'off',
    },
};
