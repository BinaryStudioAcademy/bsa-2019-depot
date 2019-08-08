/* eslint-disable react/jsx-no-bind */

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from '../PrivateRoute';
import { NotFound, Login, Forgot, Reset, MainPage, Signup, Dashboard, CodeTab } from '../../scenes';

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/registration" component={Signup} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/forgot" component={Forgot} />
      <Route exact path="/reset/:hash" component={Reset} />
      <Route exact path="/code" component={CodeTab} />
      <PrivateRoute exact path="/" component={MainPage} />
      <PrivateRoute exact path="/dashboard" component={Dashboard} />
      <Route exact path="*" component={NotFound} />
    </Switch>
  );
};

export default Routing;
