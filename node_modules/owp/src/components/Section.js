import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';

const Section = ({
    title,
    Header,
    HeaderRight,
    Footer,
    children,
    ...restProps
}) => {
    return (
        <section {...restProps}>
            {!!title && (
                <header className="flex justify-between items-center p-16">
                    <Typography color="textSecondary" variant="subheading">
                        {title}
                    </Typography>

                    {!!HeaderRight && HeaderRight}
                </header>
            )}
            {children}

            {!!Footer && Footer}
        </section>
    );
};

Section.propTypes = {
    title: PropTypes.node,
    Header: PropTypes.node,
    Footer: PropTypes.node,
    children: PropTypes.element,
};

export default Section;
