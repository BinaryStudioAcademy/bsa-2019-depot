import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CodeTab from '../../scenes/CodeTab/index';
import { NotFound, Login } from '../../scenes';

const Routing = () => {
    return (
        <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/code" component={CodeTab} />
            <Route exact path="*" component={NotFound} />
        </Switch>
    );
};

export default Routing;
