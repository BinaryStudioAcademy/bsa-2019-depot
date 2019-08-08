/* eslint-disable react/jsx-no-bind */

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from '../PrivateRoute';
import { NotFound, Login, MainPage, Signup, Dashboard } from '../../scenes';
import Header from '../Header';

const Routing = () => {
    return (
        <Switch>
            <Route exact path="/registration" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/header" component={Header} />
            <PrivateRoute exact path="/" component={MainPage} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <Route exact path="*" component={NotFound} />
        </Switch>
    );
};

export default Routing;
