import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import AuthNavigator from '../StackNavigator/AuthNavigator';
import TabNavigator from '../TabNavigator/TabNavigator';

const AppNavigator = createSwitchNavigator(
  {
    Home: TabNavigator,
    Auth: AuthNavigator
  },
  {
    initialRouteName: 'Auth'
  }
);

export default createAppContainer(AppNavigator);
