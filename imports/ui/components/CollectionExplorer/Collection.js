import React, { useState } from 'react';
import { Flashcard, NewFlashcard } from '/imports/ui/components';
import { Row, Col, Form } from 'react-bootstrap';
import { CollectionToolbar } from './CollectionToolbar';
import { FlashcardCollection } from '/imports/db/FlashcardCollection';
import { useHistory } from 'react-router-dom';

export function Collection({ name, collectionId, flashcards }) {
  const history = useHistory();
  let [selectedFlashcards, setSelectedFlashcards] = useState([]);

  let [editNameMode, setEditNameMode] = useState(false);
  let [collectionName, setCollectionName] = useState(name);

  function selectFlashcard(f) {
    setSelectedFlashcards([...selectedFlashcards, f]);
  }

  function unselectFlashcard(f) {
    setSelectedFlashcards(
      selectedFlashcards.filter(current => current._id !== f._id)
    );
  }

  async function removeFlashcards(flashcards) {
    await Promise.all(flashcards.map(f => removeFlashcard(f._id)));
  }

  async function removeFlashcard(id) {
    await FlashcardCollection.update({ _id: collectionId }, {
      $pull: {
        flashcards: { _id: id }
      }
    })

    setSelectedFlashcards([]);
  }

  async function removeCollection() {
    await FlashcardCollection.remove({ _id: collectionId });
    history.push('/collections');
  }

  async function changeName() {
    await FlashcardCollection.update({ _id: collectionId }, {
      $set: { name: collectionName }
    });
    setEditNameMode(false);
  }

  return <>
    { editNameMode 
    ?
      <Form onSubmit={e => {
        changeName();
        e.preventDefault();
      }}>
        <Form.Control
          autoFocus 
          onChange={(e) => setCollectionName(e.target.value)} 
          value={collectionName} 
          onBlur={(e) => changeName(e)}
        />
      </Form>
    :
      <div className="h5" onClick={() => setEditNameMode(true)}>{ collectionName }</div>
    }
    <CollectionToolbar 
      active={selectedFlashcards.length > 0 ? true : false} 
      onFlashcardRemove={() => removeFlashcards(selectedFlashcards)}
      onCollectionRemove={() => removeCollection()}
    />
    <Row>
      <Col lg="3">
        <NewFlashcard collectionId={collectionId}/>
      </Col>
      { flashcards.map(f => (
        <Col key={f._id} lg="3">
          <Flashcard 
            flashcard={{...f, collectionId}}
            onChecked={(f) => selectFlashcard(f)} 
            onUnchecked={(f) => unselectFlashcard(f)}
          />
        </Col>
      )) }
    </Row>
    { flashcards.length === 0 && <span>No cards in this collection.</span>}
  </>;
}