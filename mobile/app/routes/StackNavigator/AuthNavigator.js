import { createStackNavigator, createAppContainer } from 'react-navigation';
import SignInView from '../../views/SignInView';
import SignUpView from '../../views/SignUpView';
import SetUsernameView from '../../views/SetUsernameView';

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

export default createAppContainer(AuthNavigator);
