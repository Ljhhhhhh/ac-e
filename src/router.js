import React, { useContext } from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Storage from "./utils/storage";
import { ContextProvider, myContext } from "./storeByHooks/reducer";
import * as actionTypes from "./storeByHooks/actionTypes";
import App from "./App";
import Active from "./pages/active";
import Login from "./pages/login";
import Layout from "./layout/layout";
import Customer from "./pages/customer";
import Card from "./pages/card";
import Info from "./pages/info";

const storage = new Storage();

const Router = props => {
  return (
    <HashRouter>
      <App>
        <Layout>
          <Switch>
            <Route exact path="/" component={Active} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/info" component={Info} />
            <AuthorizedRoute path="/card" component={Card} />
            <AuthorizedRoute path="/customer" component={Customer} />
            <Redirect to='/' />
          </Switch>
        </Layout>
      </App>
    </HashRouter>
  );
};

const AuthorizedRoute = props => {
  const { state, dispatch } = useContext(myContext);
  if (!state.userinfo || !state.userinfo.token) {
    const storageUserinfo = storage.getStorage("userinfo");
    if (storageUserinfo) {
      dispatch({
        type: actionTypes.USERINFO,
        userinfo: storageUserinfo
      });
    } else {
      const to = props.path === '/customer' ? '/login' : '/'
      return (
        <Redirect to={to} />
      )
    }
  }

  const { component: Component } = props;
  // const userinfo = state.userinfo;

  return (
    <Route
      render={props => {
        return <Component {...props} />
      }}
    />
  );
};

const ContextRouter = () => {
  return (
    <ContextProvider>
      <Router />
    </ContextProvider>
  );
};
export default ContextRouter;
