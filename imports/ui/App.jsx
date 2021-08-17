import React from 'react';
import { 
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
 } from 'react-router-dom';
import {
  Header,
  CollectionExplorer
} from './components';
import { HttpError } from './components'
import { Container } from 'react-bootstrap'

export const App = () => (
  <Router>
    <Header/>
    <Container className="mt-3">
      <Switch>

      <Route path="/collections">
        <CollectionExplorer/>
      </Route>

      <Route exact path="/">
        <Redirect to="/collections"/>
      </Route>

      <Route>
        <HttpError.NotFound/>
      </Route>
      </Switch>
    </Container>
  </Router>
);
