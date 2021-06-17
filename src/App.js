import React, { Component } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { auth } from "./services/firebase";
import Home from "./pages/home/Home";
import Navigation from './components/navbar/Navbar';
import Contact from './pages/contact/Contact';
import Reservation from './pages/reservation/Reservation'
import Personal from './pages/personal/Personal'

function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          )
      }
    />
  );
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === false ? (
          <Component {...props} />
        ) : (
            <Redirect to="/" />
          )
      }
    />
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      loading: true
    };
  }

  componentDidMount() {
    auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false
        });
      }
    });
  }

  render() {
    return this.state.loading === true ? (
      <div className="spinner-border text-success" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    ) : (
      <Router>
      <Navigation />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/contacto" component={Contact} />
            <PrivateRoute
              path="/reserva"
              authenticated={this.state.authenticated}
              component={Reservation}
            />
            <PublicRoute
              path="/signup"
              authenticated={this.state.authenticated}
              component={SignUp}
            />
            <PublicRoute
              path="/login"
              authenticated={this.state.authenticated}
              component={Login}
            />
            <PrivateRoute
              path="/misreservas"
              authenticated={this.state.authenticated}
              component={Personal}
            />
          </Switch>
          
        </Router>
      );
  }
}

export default App;
