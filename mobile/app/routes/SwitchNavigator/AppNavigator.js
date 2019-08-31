import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import DashboardView from '../../views/DashboardView';
import AuthNavigator from '../StackNavigator/AuthNavigator';

const AppNavigator = createSwitchNavigator(
  {
    Home: DashboardView,
    Auth: AuthNavigator
  },
  {
    initialRouteName: 'Auth'
  }
);

export default createAppContainer(AppNavigator);
