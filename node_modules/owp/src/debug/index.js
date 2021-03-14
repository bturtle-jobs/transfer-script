import log from 'console.pretty';

export const depr = (...args) => {
    if (process.env.NODE_ENV === 'development') {
        log.red('DEPRECATED:', ...args);
    }
};
