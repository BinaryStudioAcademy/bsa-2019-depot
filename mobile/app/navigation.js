import { NavigationActions } from 'react-navigation';

let navigator;

const setTopLevelNavigation = navigatorRef => {
  navigator = navigatorRef;
};

const navigate = (routeName, params) => {
  if (navigator) {
    navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params
      })
    );
  }
};

export default {
  navigate,
  setTopLevelNavigation
};
