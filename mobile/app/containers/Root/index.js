import React from 'react';
//import { Provider } from 'react-redux';
//import { store } from '../../store';
//import SignInView from '../../views/SignInView';
//import SignUpView from '../../views/SignUpView';
import { AuthNavigator } from '../../routes';
const Root = () => (
  <AuthNavigator />
  //<Provider store={store}/>
  // <SignUpView />
  //</Provider>
);

export default Root;
