import React, { Fragment, useEffect} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import "bootstrap/dist/js/bootstrap.js";
import "./scss/style.scss";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import {Provider} from 'react-redux';
import store from './store';
import Alert from './components/layout/Alert';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
 
if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
        <Alert />
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </section>

      </Fragment>
    </Router>
    </Provider>
  );
};

export default App;