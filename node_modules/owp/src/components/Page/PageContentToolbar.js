import { Icon, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { FuseAnimate } from 'owp/@fuse';
import React from 'react';

const PageContentToolbar = ({
    icon = 'blur_on',
    title = '',
    className,
    toolbarRight,
    ...restProps
}) => {
    const classes = classNames('flex flex-shrink items-center px-24', className);

    return (
        <div {...restProps} className={classes}>
            {!!title && (
                <>
                    <FuseAnimate animation="transition.expandIn" delay={300}>
                        <Icon className="text-32 mr-12">{icon}</Icon>
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Typography variant="h6" className="hidden sm:flex">
                            {title}
                        </Typography>
                    </FuseAnimate>
                </>
            )}

            {!!toolbarRight && <div className="d-block flex-grow text-right">{toolbarRight}</div>}
        </div>
    );
};

export default PageContentToolbar;
