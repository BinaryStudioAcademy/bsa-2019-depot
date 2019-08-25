import React from 'react';
import { render } from 'react-dom';
import Home from './scenes/Home';

import './styles/reset.scss';
import 'semantic-ui-less/semantic.less';
import './styles/common.scss';
import 'react-toastify/dist/ReactToastify.css';

const target = document.getElementById('root');

const { detect } = require('detect-browser');
const browser = detect();

if (browser && browser.name === 'chrome') {
  const warningWrap = document.createElement('p');
  warningWrap.classList.add('warning-ie');
  warningWrap.innerHTML = 'This browser is not supported! ¯\\_(ツ)_/¯';
  target.appendChild(warningWrap);
} else {
  render(<Home />, target);
}
