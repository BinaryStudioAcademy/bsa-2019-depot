import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Routing from '../../containers/Routing';
import { store } from '../../store';

const Home = () => (
  <Provider store={store}>
    <Router>
      <Routing />
    </Router>
  </Provider>
);

export default Home;
