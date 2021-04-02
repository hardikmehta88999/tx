import React from "react";

import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import Login from "./components/Login";
import User from './components/User'
import Profile from "./components/Profile";
import Signup from './components/Signup';
import OtherProfile from './components/OtherProfile'
function App(props) {
  const { isAuthenticated, isVerifying } = props;
  return (

    <Switch>
      <ProtectedRoute
        exact
        path="/"
        component={Home}
        isAuthenticated={isAuthenticated}
        isVerifying={isVerifying}
      />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/user" component={User} />
      <Route path="/userprofile" component={OtherProfile} />
      <ProtectedRoute
        exact
        path="/profile"
        component={Profile}
        isAuthenticated={isAuthenticated}
        isVerifying={isVerifying}
      />
    </Switch>
  );
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying
  };
}

export default connect(mapStateToProps)(App);
