import React, { useState } from 'react';
import { Flashcard, NewFlashcard } from '/imports/ui/components';
import { Row, Col } from 'react-bootstrap';
import { CollectionToolbar } from './CollectionToolbar';

export function Collection({ name, collectionId, flashcards, onChecked, onUnchecked }) {
  let [selectedFlashcards, setSelectedFlashcards] = useState([]);

  function selectFlashcard(f) {
    setSelectedFlashcards([...selectedFlashcards, f]);
  }

  function unselectFlashcard(f) {
    setSelectedFlashcards(
      selectedFlashcards.filter(current => current._id !== f._id)
    );
  }

  return <>
    <div className="display-6 mb-3">{ name }</div>
    <CollectionToolbar show={selectedFlashcards.length > 0 ? true : false} />
    <Row>
      <Col lg="3">
        <NewFlashcard collectionId={collectionId}/>
      </Col>
      { flashcards.map(f => (
        <Col key={f._id} lg="3">
          <Flashcard 
            flashcard={f}
            onChecked={(f) => selectFlashcard(f)} 
            onUnchecked={(f) => unselectFlashcard(f)}
          />
        </Col>
      )) }
    </Row>
    { flashcards.length === 0 && <span>No cards in this collection.</span>}
  </>;
}