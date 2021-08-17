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
    <Col lg="2">
      <span className="h6 d-inline-block mb-3">Your collections</span>
      <CollectionList collections={collections}/>
    </Col>
    <Col lg="10">
      { collections.map(c => (
        <Route key={c._id} path={`/collections/${c._id}`}>
          <Collection name={c.name} collectionId={c._id} flashcards={c.flashcards}/>
        </Route>
      )) }
    </Col>
  </Row>
}