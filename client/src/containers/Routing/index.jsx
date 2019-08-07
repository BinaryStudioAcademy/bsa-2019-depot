import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotFound, Login, MainPage, Signup } from '../../scenes';

const Routing = () => {
    return (
        <Switch>
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/" component={MainPage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="*" component={NotFound} />
        </Switch>
    );
};

export default Routing;
