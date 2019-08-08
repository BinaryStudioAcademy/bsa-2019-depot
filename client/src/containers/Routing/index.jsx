import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from '../PrivateRoute';
import { NotFound, Login, MainPage, Signup, Dashboard } from '../../scenes';

import { fetchCurrentUser } from '../../routines/routines';

import Header from '../Header';

class Routing extends React.Component {
    componentDidMount() {
        this.props.fetchCurrentUser();
    }

    render() {
        return (
            <Switch>
                <Route exact path="/registration" component={Signup} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/header" component={Header} />
                <PrivateRoute exact path="/" component={MainPage} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <Route exact path="*" component={NotFound} />
            </Switch>
        );
    }
}

Routing.propTypes = {
    fetchCurrentUser: PropTypes.func.isRequired
};

const mapDispatchToProps = {
    fetchCurrentUser
};

export default connect(
    null,
    mapDispatchToProps
)(Routing);
