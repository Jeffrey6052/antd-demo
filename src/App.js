import React from 'react';

import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import HomePage from "./pages/Home"
import Demo1Page from "./pages/Demo1"
import Demo2Page from "./pages/Demo2"
import ButtonPage from "./pages/Button"
import ObjModel3DPage from "./pages/ObjModel3D"
import GlbModel3DPage from "./pages/GlbModel3D"

function App() {
  return (
    <Router>
      <div>
        <Switch>
        <Route path="/glb_model_3d">
            <GlbModel3DPage />
          </Route>
          <Route path="/obj_model_3d">
            <ObjModel3DPage />
          </Route>
          <Route path="/demo1">
            <Demo1Page />
          </Route>
          <Route path="/demo2">
            <Demo2Page />
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
