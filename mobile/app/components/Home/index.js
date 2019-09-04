import React, { Component } from 'react';
import DashboardNavigator from '../../routes/DashboardNavigator/DashboardNavigator';
import { createAppContainer } from 'react-navigation';

class Home extends Component {
  render() {
    return <DashboardNavigator />;
  }
}

export default Home;
