import React from 'react';

// import { Provider } from 'react-redux'
// import rootReducer from '../'
// const store = createStore(rootReducer)

import { HashRouter, Switch, Route } from 'react-router-dom'

import Home from './views/home'
import Profile from './views/profile'
import Register from './views/register'
import forgotPassword from './views/forgotPassword';
import resetPassword from './views/resetPassword';
import NotFound from './views/NotFound'


export default class Routes extends React.Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/" component={Home} exact></Route>
          <Route path="/profile"  component={Profile}></Route>
          <Route path="/register" component={Register}></Route>
          <Route path="/reset-password"  component={resetPassword}></Route>
          <Route path="/forgot-password" component={forgotPassword}></Route>
          <Route component={NotFound}></Route>
        </Switch>
      </HashRouter>
    )
  }
}
