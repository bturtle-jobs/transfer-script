module.exports = (file, api, opts) => {
    const j = api.jscodeshift;

    return (
        j(file.source)
            .find(j.ImportDeclaration)
            // .filter((path) => {
            //     return /(@fuse|@owp|api|auth)/.test(path.value.source.value);
            // })
            .forEach((path) => {
                let importSource = path.value.source.value;

                if (importSource === '@owp') {
                    console.log('importSource', importSource);
                    path.value.source.value = 'owp/components';
                } else if (/.*@owp/.test(importSource)) {
                    path.value.source.value = importSource.replace(/.*@owp/, 'owp');
                } else if (/.*@fuse/.test(importSource)) {
                    path.value.source.value = importSource.replace(/.*@fuse/, 'owp/@fuse');
                } else if (/.*api/.test(importSource)) {
                    path.value.source.value = importSource.replace(/.*api/, 'owp/api');
                } else if (/.*auth/.test(importSource)) {
                    path.value.source.value = importSource.replace(/.*auth/, 'owp/auth');
                } else if (/.*common/.test(importSource)) {
                    path.value.source.value = importSource.replace(/.*common/, 'owp/common');
                } else if (/.*constants/.test(importSource)) {
                    path.value.source.value = importSource.replace(/.*constants/, 'owp/constants');
                } else if (/.*debug/.test(importSource)) {
                    path.value.source.value = importSource.replace(/.*debug/, 'owp/debug');
                } else if (/.*fuse-configs/.test(importSource)) {
                    path.value.source.value = importSource.replace(
                        /.*fuse-config/,
                        'owp/fuse-configs'
                    );
                } else if (/.*hooks/.test(importSource)) {
                    path.value.source.value = importSource.replace(/.*hooks/, 'owp/hooks');
                } else if (/.*store/.test(importSource)) {
                    path.value.source.value = importSource.replace(/.*store/, 'owp/store');
                } else if (/.*jwtService/.test(importSource)) {
                    path.value.source.value = importSource.replace(
                        /.*jwtService/,
                        'owp/jwtService'
                    );
                } else if (/.*styles/.test(importSource)) {
                    if (!importSource.includes('@material')) {
                        path.value.source.value = importSource.replace(/.*styles/, 'owp/styles');
                    }
                } else if (/.*TGEvent/.test(importSource)) {
                    path.value.source.value = importSource.replace(/.*TGEvent/, 'owp/TGEvent');
                } else if (/.*@wrapper/.test(importSource)) {
                    path.value.source.value = importSource.replace(/.*@wrapper/, 'owp/wrapper');
                } else if (/.*history/.test(importSource)) {
                    path.value.source.value = importSource.replace(/.*history/, 'owp/history');
                }
            })
            .toSource()
    );
};
