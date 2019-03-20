module.exports = {
    env: {
        es6: true,
        node: true
    },
    plugins: ['node', 'dependencies'],
    extends: ['plugin:node/recommended', 'eslint-config-salesflare'],
    rules: {}
};