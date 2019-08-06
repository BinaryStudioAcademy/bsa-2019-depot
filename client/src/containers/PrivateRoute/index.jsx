/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({ isAuthenticated, location, ...props }) =>
    isAuthenticated ? (
        <Route {...props} render={({ Component, ...rest }) => <Component {...rest} />} />
    ) : (
        <Redirect to={{ pathname: '/login', state: { from: location } }} />
    );

PrivateRoute.propTypes = {
    isAuthenticated: PropTypes.bool,
    location: PropTypes.any
};

PrivateRoute.defaultProps = {
    location: undefined
};

const mapStateToProps = rootState => rootState.authReducer;

export default connect(mapStateToProps)(PrivateRoute);
