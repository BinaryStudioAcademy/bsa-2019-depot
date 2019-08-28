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

  componentDidUpdate(prevProps) {
    const { isAuthorized } = this.props;
    if (prevProps.isAuthorized !== isAuthorized && isAuthorized) {
      NavigationService.navigate('Home');
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
  store: PropTypes.object
};

const mapStateToProps = ({ profile: { isAuthorized } }) => ({
  isAuthorized
});

const mapDispatchToProps = { fetchCurrentUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
