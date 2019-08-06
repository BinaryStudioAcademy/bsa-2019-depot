import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotFound, Login } from '../../scenes';
import Dashboard from '../../containers/Dashboard';

const Routing = () => {
    return (
        <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="*" component={NotFound} />
        </Switch>
    );
};

export default Routing;
