import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import AuthNavigator from '../StackNavigator/AuthNavigator';
import StackDashboardNavigator from '../StackNavigator/StackDashboardNavigator';

import DrawerNavigator from '../DrawerNavigator/DrawerNavigator';
import Home from '../../components/Home';
import DashboardNavigator from '../../routes/DashboardNavigator/DashboardNavigator';

const AppNavigator = createSwitchNavigator(
  {
    Home: DashboardNavigator,
    Auth: AuthNavigator
  },
  {
    initialRouteName: 'Auth'
  }
);

export default createAppContainer(AppNavigator);
