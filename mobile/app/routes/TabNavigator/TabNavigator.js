import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ReposView from '../../views/ReposView';
import PullsView from '../../views/PullsView';
import IssuesView from '../../views/IssuesView';
import StarsView from '../../views/StarsView';

const TabNavigator = createMaterialTopTabNavigator({
  Repos: {
    screen: ReposView
  },
  Pulls: {
    screen: PullsView
  },
  Issues: {
    screen: IssuesView
  },
  Stars: {
    screen: StarsView
  }
});

export default TabNavigator;
