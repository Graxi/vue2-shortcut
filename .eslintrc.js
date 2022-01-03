module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true
    },
    'extends': 'eslint:recommended',
    "parserOptions": {
        "ecmaVersion": 2017
    },
    // temporarily set
    'rules': {
        'no-unsafe-finally': 'off',
        'no-redeclare': 'off'
    }
};
