import React from 'react';
import { Collection } from './Collection'
import { useTracker } from 'meteor/react-meteor-data';
import { FlashcardCollection } from '/imports/db/FlashcardCollection';
import { Route, Switch, Redirect } from 'react-router-dom';
import { StudyCollection } from '../StudyCollection';

export function CollectionExplorer(props) {
  const collections = useTracker(() => FlashcardCollection.find({}).fetch());

  return <Switch>
    { collections.map(c => (
      <Route key={c._id} path={`/collections/${c._id}/study`}>
        <StudyCollection collectionId={c._id}/>
      </Route>
    )) }

    { collections.map(c => (
      <Route key={c._id} path={`/collections/${c._id}`}>
        <Collection name={c.name} collectionId={c._id} flashcards={c.flashcards}/>
      </Route>
    )) }

    <Route>
      { collections[0]?._id && <Redirect to={`/collections/${collections[0]._id}`} /> }
      { collections.length === 0 && <span>No collections.</span>}
    </Route>
  </Switch>
}