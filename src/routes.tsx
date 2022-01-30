import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import App from './pages/App';
import LoginPage from './pages/login/index';
import Layout from './pages/layout';
import store from './store';
import Register from './pages/login/register';
import NoteList from './pages/noteList';

export default function() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={Register} />
        {/* <PrivateRoute> */}
        <Route path="/main">
          <Layout>
            <Route exact path="/main/notelist" component={NoteList} />
          </Layout>
        </Route>
        {/* </PrivateRoute> */}
      </Switch>
    </Router>
  );
}

function PrivateRoute({ children, ...rest }) {
  const { isAuth } = store.getState().user;

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
