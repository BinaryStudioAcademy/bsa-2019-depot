import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import { AppRegistry, Dimensions } from 'react-native';
import SideMenu from '../../components/SideMenu';

const DrawerNavigator = createDrawerNavigator(
  {
    contentComponent: SideMenu
  },
  {
    drawerType: 'front',
    drawerWidth: 50
  }
);

export default createAppContainer(DrawerNavigator);
