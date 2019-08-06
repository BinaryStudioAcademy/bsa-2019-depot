import React from 'react';
import { Route, Switch } from 'react-router-dom';
import IssuesTab from '../IssuesTab/index';
import { NotFound, Login } from '../../scenes';

const Routing = () => {
    return (
        <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/issues" component={IssuesTab} />
            <Route exact path="*" component={NotFound} />
        </Switch>
    );
};

export default Routing;
