import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from '../PrivateRoute';
import {
    NotFound,
    Login,
    MainPage,
    Signup,
    Dashboard,
    CreateRepository,
    EmptyRepoPage
} from '../../scenes';

const Routing = () => {
    return (
        <Switch>
            <Route exact path="/registration" component={Signup} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/" component={MainPage} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <Route exact path="/:username/new" component={CreateRepository} />
            <Route exact path="/:username/:repository" component={EmptyRepoPage} />
            <Route exact path="*" component={NotFound} />
        </Switch>
    );
};

export default Routing;
