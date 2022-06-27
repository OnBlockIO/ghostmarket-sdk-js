// eslint-disable-next-line no-undef
module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        'no-underscore-dangle': 'off',
        semi: ['error', 'never'],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        'no-unused-vars': 'off',
        'no-console': [
            'error',
            {
                allow: ['log', 'warn', 'error', 'info', 'group', 'groupEnd'],
            },
        ],
        '@typescript-eslint/no-unused-vars': 'error',
        'prettier/prettier': [
            'error',
            {
                printWidth: 100,
                endOfLine: 'crlf',
                tabWidth: 4,
                useTabs: false,
                singleQuote: true,
                semi: false,
                arrowParens: 'avoid',
                trailingComma: 'all',
            },
        ],
    },
}
