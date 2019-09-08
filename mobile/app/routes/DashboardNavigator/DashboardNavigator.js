import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ReposView from '../../views/ReposView';
import PullsView from '../../views/PullsView';
import IssuesView from '../../views/IssuesView';
import StarsView from '../../views/StarsView';
import DashboardHeader from '../../components/DashboardHeader';
import SideMenu from '../../components/SideMenu';
import React from 'react';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import Notifications from '../../components/Notifications';
import IssueView from '../../views/IssueView';
import colors from '../../config/color.config';

const TabNav = createMaterialTopTabNavigator({
  Repos: { screen: ReposView },
  Pulls: { screen: PullsView },
  Issues: { screen: IssuesView },
  Stars: { screen: StarsView }
});

const StackTab = createStackNavigator({
  Tabs: {
    screen: TabNav,
    navigationOptions: {
      header: <DashboardHeader />
    }
  },
  Notifications: {
    screen: Notifications
  },
  IssueView: {
    screen: IssueView
  }
});

const Drawer = createDrawerNavigator(
  {
    Tabs: {
      screen: StackTab
    }
  },
  {
    // eslint-disable-next-line react/display-name
    contentComponent: props => <SideMenu {...props} />,
    drawerType: 'front',
    drawerWidth: 200,
    overlayColor: 1
  }
);

export default Drawer;
