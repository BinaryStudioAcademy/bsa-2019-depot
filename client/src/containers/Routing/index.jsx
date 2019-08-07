import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RepoFileTree from '../../components/RepoFileTree/index';
import { NotFound, Login } from '../../scenes';

const Routing = () => {
    return (
        <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/tree" component={RepoFileTree} />
            <Route exact path="*" component={NotFound} />
        </Switch>
    );
};

export default Routing;
