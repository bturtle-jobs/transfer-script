const { resolveApp } = require('./config-overrides');
const { alias } = require('react-app-rewire-alias');

module.exports = {
    webpack: function (config, env) {
        // config.module.rules[2].oneOf[1].include = [
        //     config.module.rules[2].oneOf[1].include,
        //     resolveApp('./node_modules/owp/src'),
        // ];

        // config.resolve.plugins.pop();
        // config.resolve.alias['owp'] = resolveApp('./node_modules/owp/src');

        // return config;
        alias({
            owp: './node_modules/owp/src',
        })(config);

        return config;
    },
};
