import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const renderComponent = ({ Component, ...rest }) => <Component {...rest} />;

const PrivateRoute = ({ isAuthorized, location, ...props }) =>
    isAuthorized ? (
        <Route {...props} render={renderComponent} />
    ) : (
        <Redirect to={{ pathname: '/login', state: { from: location } }} />
    );

PrivateRoute.propTypes = {
    isAuthorized: PropTypes.bool,
    location: PropTypes.any
};

renderComponent.propTypes = {
    Component: PropTypes.any
};

PrivateRoute.defaultProps = {
    location: undefined
};

const mapStateToProps = rootState => {
    return {
        ...rootState.auth
    };
};

export default connect(mapStateToProps)(PrivateRoute);
