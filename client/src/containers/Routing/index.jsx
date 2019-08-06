import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from '../../components/Login';
import NotFound from '../../scenes/NotFound';

const Routing = () => {
    return (
        <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="*" component={NotFound} />
        </Switch>
    );
};

export default Routing;
