import { Icon } from '@material-ui/core';
import React, { Fragment } from 'react';

const Breadcrumb = ({ items = [] }) => {
    return (
        <div className="inline-flex items-center">
            {items && items.length
                ? items.map((item, index) => (
                      <Fragment key={index}>
                          <span>{item}</span>
                          {index !== items.length - 1 && (
                              <Icon>keyboard_arrow_right</Icon>
                          )}
                      </Fragment>
                  ))
                : ''}
        </div>
    );
};

export default Breadcrumb;
