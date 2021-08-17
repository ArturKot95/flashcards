import React from 'react';
import { CollectionList } from './CollectionList';
import { Collection } from './Collection'
import { Row, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { FlashcardCollection } from '/imports/db/FlashcardCollection';
import { Route } from 'react-router-dom';

export function CollectionExplorer(props) {
  const collections = useTracker(() => FlashcardCollection.find({}).fetch());

  return <Row>
    { collections.map(c => (
      <Route key={c._id} path={`/collections/${c._id}`}>
        <Collection name={c.name} collectionId={c._id} flashcards={c.flashcards}/>
      </Route>
    )) }
  </Row>
}