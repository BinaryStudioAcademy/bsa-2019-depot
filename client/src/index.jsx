import React from 'react';
import { render } from 'react-dom';
import Home from './scenes/Home';

import './styles/reset.scss';
import 'semantic-ui-less/semantic.less';
import './styles/common.scss';
import 'react-toastify/dist/ReactToastify.css';

const target = document.getElementById('root');

render(<Home />, target);
