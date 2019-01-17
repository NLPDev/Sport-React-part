import style from '../scss/main.scss'
import 'react-hot-loader/patch'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import { AppContainer } from 'react-hot-loader';

import AppRoot from './create-routes'
import Fav32 from '../images/favicon-32x32.png'
import Fav180 from '../images/favicon-180x180.png'
import Fav192 from '../images/favicon-192x192.png'
import Fav270 from '../images/favicon-270x270.png'
import Fav512 from '../images/favicon-512x512.png'

const render = Comp => ReactDOM.render(
            <AppContainer>
              <Comp/>
            </AppContainer>,
            document.getElementById('root'));

render(AppRoot);

if (module.hot) {

  module.hot.accept(['./create-routes', './app'], () => {

   render(AppRoot);
  });
}
