const OwpLog = (_s,...args) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(_s,args)
    }
};

export default OwpLog;
