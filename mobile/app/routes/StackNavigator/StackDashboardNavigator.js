import { createStackNavigator } from 'react-navigation';
import SignInView from '../../views/AuthViews/SignInView';
import SignUpView from '../../views/AuthViews/SignUpView';
import SetUsernameView from '../../views/AuthViews/SetUsernameView';
import DashboardNavigator from '../DashboardNavigator/DashboardNavigator';
import DashboardHeader from '../../components/DashboardHeader';
import React from 'react';
import DrawerNavigator from '../DrawerNavigator/DrawerNavigator';

const StackDashboardNavigator = createStackNavigator({
  Dashboard: {
    screen: DashboardNavigator,
    navigationOptions: {
      header: <DashboardHeader />
    }
  },
  Drawer: DrawerNavigator
});

export default StackDashboardNavigator;
