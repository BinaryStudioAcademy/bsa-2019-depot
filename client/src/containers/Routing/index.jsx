import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import Spinner from '../../components/Spinner';
import { NotFound, Login, Forgot, Reset, MainPage, Signup, Dashboard, SettingsProfile } from '../../scenes';
import { fetchCurrentUser } from '../../routines/routines';

class Routing extends React.Component {
    componentDidMount() {
        this.props.fetchCurrentUser();
    }

    render() {
        const { loading } = this.props;

        return loading ? (
            <Spinner />
        ) : (
            <Switch>
                <Route exact path="/registration" component={Signup} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/forgot" component={Forgot} />
                <Route exact path="/reset/:hash" component={Reset} />
                <Route exact path="/settings/profile" component={SettingsProfile} />
                <PrivateRoute exact path="/" component={MainPage} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <Route exact path="*" component={NotFound} />
            </Switch>
        );
    }
}

Routing.propTypes = {
    loading: PropTypes.bool.isRequired,
    fetchCurrentUser: PropTypes.func.isRequired
};

const mapStateToProps = ({ profile: { loading } }) => ({
    loading
});

const mapDispatchToProps = {
    fetchCurrentUser
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Routing);
