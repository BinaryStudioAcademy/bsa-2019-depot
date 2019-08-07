/* eslint-disable react/jsx-no-bind */

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import CommitsPage from '../CommitsPage/index';
import { NotFound, Login, MainPage } from '../../scenes';

const Routing = () => {
    return (
        <Switch>
            <Route exact path="/" component={MainPage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/commits" component={CommitsPage} />
            <PrivateRoute exact path="/" component={MainPage} />
            <PrivateRoute exact path="/dashboard" component={MainPage} />
            <Route exact path="*" component={NotFound} />
        </Switch>
    );
};

export default Routing;
