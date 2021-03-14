import { appsConfigs } from 'main/content/apps/appsConfigs';
import { examplesConfig } from 'main/content/examples/examplesConfig';
import { LoginConfig } from 'main/content/login/LoginConfig';
import { LogoutConfig } from 'main/content/logout/LogoutConfig';
import { pagesConfigs } from 'main/content/pages/pagesConfigs';
import { RegisterConfig } from 'main/content/register/RegisterConfig';
import { FuseUtils } from 'owp/@fuse/index';
import React from 'react';
import { Redirect } from 'react-router-dom';

const routeConfigs = [
    ...pagesConfigs,
    LoginConfig,
    RegisterConfig,
    examplesConfig,
    LogoutConfig,
];

export const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
    {
        path: '/',
        exact: true,
        component: () => <Redirect to="pages/C101000"/>,
    },
    {
        component: () => <Redirect to="/pages/errors/error-404"/>,
    },
];
