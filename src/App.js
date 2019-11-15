import React from 'react';

import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import HomePage from "./pages/Home"
import AboutPage from "./pages/About"
import ButtonPage from "./pages/Button"

function App() {
  return (
    <Router>
      <div style={{margin: "10px"}}>
        <Switch>
          <Route path="/about">
            <AboutPage />
          </Route>
          <Route path="/button">
            <ButtonPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App
