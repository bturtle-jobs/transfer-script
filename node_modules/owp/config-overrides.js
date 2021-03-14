const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const { alias } = require('react-app-rewire-alias');

module.exports = {
    webpack: function (config, env) {
        // config.resolve.alias['owp'] = resolveApp('./src/');

        // return config;
        alias({
            owp: './src',
        })(config);

        return config;
    },
    paths: function (paths, env) {
        paths.appIndexJs = resolveApp('./src/render-app.js');
        return paths;
    },
};

module.exports.resolveApp = resolveApp;
