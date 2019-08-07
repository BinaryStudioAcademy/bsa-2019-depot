/* eslint-disable react/jsx-no-bind */

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import { NotFound, Login, Forgot, Reset, MainPage } from '../../scenes';

const Routing = () => {
    return (
        <Switch>
            <Route exact path="/" component={MainPage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/forgot" component={Forgot} />
            <Route exact path="/reset/:hash" component={Reset} />
            <PrivateRoute exact path="/" component={MainPage} />
            <PrivateRoute exact path="/dashboard" component={MainPage} />
            <Route exact path="*" component={NotFound} />
        </Switch>
    );
};

export default Routing;
