import { createStackNavigator } from 'react-navigation';
import SignInView from '../../views/AuthViews/SignInView';
import SignUpView from '../../views/AuthViews/SignUpView';
import SetUsernameView from '../../views/AuthViews/SetUsernameView';

const AuthNavigator = createStackNavigator({
  SignIn: {
    screen: SignInView,
    navigationOptions: {
      header: null
    }
  },
  SignUp: {
    screen: SignUpView,
    navigationOptions: {
      header: null
    }
  },
  SetUsername: {
    screen: SetUsernameView,
    navigationOptions: {
      header: null
    }
  }
});

export default AuthNavigator;
