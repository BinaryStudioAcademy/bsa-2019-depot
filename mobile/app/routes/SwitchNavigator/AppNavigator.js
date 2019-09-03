import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import AuthNavigator from '../StackNavigator/AuthNavigator';
import StackDashboardNavigator from '../StackNavigator/StackDashboardNavigator';
import DashboardNavigator from '../DashboardNavigator/DashboardNavigator';

const AppNavigator = createSwitchNavigator(
  {
    Home: StackDashboardNavigator,
    Auth: AuthNavigator
  },
  {
    initialRouteName: 'Auth'
  }
);

export default createAppContainer(AppNavigator);
