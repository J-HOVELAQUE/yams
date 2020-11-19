import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


import Game from './components/game';
import Home from './components/home';

import playerNames from './reducers/playerNames';

import { Provider } from 'react-redux';

import { createStore, combineReducers } from 'redux';

const store = createStore(combineReducers({ playerNames }));


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/new-game/" exact component={Game} />

        </Switch>
      </Router>
    </Provider>
  )

}
export default App;
