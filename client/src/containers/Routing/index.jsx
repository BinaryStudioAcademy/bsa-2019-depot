import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotFound, Login } from '../../scenes';
import { Signup } from '../../components';

const Routing = () => {
    return (
        <Switch>
            <Route exact path="/register" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="*" component={NotFound} />
        </Switch>
    );
};

export default Routing;
