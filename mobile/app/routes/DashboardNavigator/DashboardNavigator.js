import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ReposView from '../../views/ReposView';
import PullsView from '../../views/PullsView';
import IssuesView from '../../views/IssuesView';
import StarsView from '../../views/StarsView';
import DashboardHeader from '../../components/DashboardHeader';
import { createAppContainer } from 'react-navigation';
import { AppRegistry, Dimensions } from 'react-native';
import SideMenu from '../../components/SideMenu';
import React from 'react';
import { TabNavigator, createStackNavigator, createDrawerNavigator } from 'react-navigation';
import Notifications from '../../components/Notifications';
import Icon from 'react-native-vector-icons/FontAwesome';

// const DashboardNavigator = createMaterialTopTabNavigator({
//   Repos: { screen: ReposView },
//   Pulls: { screen: PullsView },
//   Issues: { screen: IssuesView },
//   Stars: { screen: StarsView }
// });

const Repos = createStackNavigator(
  {
    Repos: {
      screen: ReposView
    }
  },
  {
    headerMode: 'none'
  }
);

const TabNav = createMaterialTopTabNavigator({
  Repos: Repos,
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
  }
});

const Drawer = createDrawerNavigator(
  {
    Tabs: {
      screen: StackTab
    }
  },
  {
    contentComponent: props => <SideMenu {...props} />,
    drawerType: 'front',
    drawerWidth: 200,
    overlayColor: 1
  }
);

export default Drawer;
