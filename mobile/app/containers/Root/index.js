import React from 'react';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AppNavigator } from '../../routes';
import { fetchCurrentUser } from '../../routines/routines';

import NavigationService from '../../navigation';
import storageHelper from '../../helpers/storageHelper';

class Root extends React.Component {
  async componentDidMount() {
    const { fetchCurrentUser } = this.props;
    const token = await storageHelper.get('token');
    if (token)
      Promise.resolve()
        .then(() => {
          NavigationService.navigate('Home');
        })
        .then(() => {
          fetchCurrentUser();
        });
    else NavigationService.navigate('Auth');
  }

  async componentDidUpdate(prevProps) {
    const { isAuthorized, currentUser } = this.props;
    if (prevProps.isAuthorized !== isAuthorized && isAuthorized) {
      if (!currentUser.username) {
        NavigationService.navigate('SetUsername');
      } else {
        NavigationService.navigate('Home');
      }
    }
  }

  getNavigator = navigatorRef => {
    NavigationService.setTopLevelNavigation(navigatorRef);
  };

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <AppNavigator ref={this.getNavigator} />
      </Provider>
    );
  }
}

Root.propTypes = {
  isAuthorized: PropTypes.bool,
  fetchCurrentUser: PropTypes.func,
  store: PropTypes.object,
  currentUser: PropTypes.object
};

const mapStateToProps = ({ profile: { isAuthorized, currentUser } }) => ({
  isAuthorized,
  currentUser
});

const mapDispatchToProps = { fetchCurrentUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
