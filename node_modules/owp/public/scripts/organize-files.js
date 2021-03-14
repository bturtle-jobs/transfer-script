const fs = require('fs');
const path = require('path');

function run() {
    const dirs = [
        '@bootstrap',
        '@fuse',
        '@lodash',
        '@owp',
        '@TGEvent',
        '@wrapper',
        'auth',
        'fake-db',
        'fuse-configs',
        'jwtService',
        'store',
        'styles',
    ];
    const files = ['history.js', 'index.js', 'logo.svg', 'store.js'];

    const resolvePath = (p) => path.join(process.cwd(), './src', p);

    dirs.forEach((dir) => {
        fs.rmdirSync(resolvePath(dir), { recursive: true });
    });

    files.forEach((file) => {
        fs.unlinkSync(resolvePath(file));
    });
}

run();
