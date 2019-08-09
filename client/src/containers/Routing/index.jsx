import React from 'react';
import { Route, Switch } from 'react-router-dom';
import IssuesTab from '../IssuesTab/index';
import RepoSettings from '../SettingsTab/index';
import PrivateRoute from '../PrivateRoute';
import { NotFound, Login, MainPage, Signup, Dashboard } from '../../scenes';

const Routing = () => {
    return (
        <Switch>
            <Route exact path="/registration" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/is" component={IssuesTab} />
            <Route exact path="/a-kuhareno/bsa-depot/settings" component={RepoSettings} />
            <PrivateRoute exact path="/" component={MainPage} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <Route exact path="*" component={NotFound} />
        </Switch>
    );
};

export default Routing;
