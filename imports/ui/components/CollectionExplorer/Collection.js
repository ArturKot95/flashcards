import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { FlashcardCollection } from '/imports/db/FlashcardCollection';
import { Flashcard } from '/imports/ui/components';
import { Row, Col } from 'react-bootstrap';
import { CollectionToolbar } from './CollectionToolbar';

export function Collection({ name, flashcards }) {
  return <>
    <div className="display-6 mb-3">{ name }</div>
    <CollectionToolbar />
    <Row>
      { flashcards.map(f => (
        <Col key={f._id} lg="3">
          <Flashcard flashcard={f}/>
        </Col>
      )) }
    </Row>
    { flashcards.length === 0 && <span>No cards in this collection.</span>}
  </>;
}