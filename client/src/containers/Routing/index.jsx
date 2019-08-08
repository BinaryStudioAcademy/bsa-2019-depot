/* eslint-disable react/jsx-no-bind */

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from '../PrivateRoute';
import { NotFound, Login, MainPage, Signup, GoogleCallback, Dashboard } from '../../scenes';

const Routing = () => {
    return (
        <Switch>
            <Route exact path="/registration" component={Signup} />
            <Route exact path="/auth/google/callback" component={GoogleCallback} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/" component={MainPage} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <Route exact path="*" component={NotFound} />
        </Switch>
    );
};

export default Routing;
