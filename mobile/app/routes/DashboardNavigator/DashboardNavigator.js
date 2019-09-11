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
import PullView from '../../views/PullView';
import colors from '../../config/color.config';

const TabNav = createMaterialTopTabNavigator(
  {
    Issues: { screen: IssuesView },
    Pulls: { screen: PullsView },
    Repos: { screen: ReposView },
    Stars: { screen: StarsView }
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: colors.greyHeader
      },
      indicatorStyle: {}
    },
    lazy: true
  }
);

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
    screen: IssueView,
    navigationOptions: {
      title: 'Issue',
      headerStyle: {
        backgroundColor: colors.greyHeader
      },
      headerTintColor: colors.white
    }
  },
  PullView: {
    screen: PullView,
    navigationOptions: {
      title: 'Pull Request',
      headerStyle: {
        backgroundColor: colors.greyHeader
      },
      headerTintColor: colors.white
    }
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
