import React from 'react';
import AppHeader from './components/AppHeader.jsx';
import CollectionPage from './components/CollectionPage.jsx';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import Collections from '/imports/db/Collections';
import { Container } from 'semantic-ui-react';

export function App() {
  const collections = useTracker(() => 
    Collections.find({}, { fields: { flashcards: 0 } }).fetch() 
  );

  return <BrowserRouter>
    <AppHeader />

    <Container>
      <Switch>
        { collections.map(c => (
          <Route key={c._id} path={`/collections/${c._id}`}>
            <CollectionPage collectionId={c._id} />
          </Route>
        )) }
      </Switch>
    </Container>
    
  </BrowserRouter>
}