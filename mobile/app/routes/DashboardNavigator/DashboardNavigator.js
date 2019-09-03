import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ReposView from '../../views/ReposView';
import PullsView from '../../views/PullsView';
import IssuesView from '../../views/IssuesView';
import StarsView from '../../views/StarsView';
import DashboardHeader from '../../components/DashboardHeader';

const DashboardNavigator = createMaterialTopTabNavigator({
  Repos: { screen: ReposView },
  Pulls: { screen: PullsView },
  Issues: { screen: IssuesView },
  Stars: { screen: StarsView }
});

export default DashboardNavigator;
