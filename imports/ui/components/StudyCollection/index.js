import React, { useEffect, useState } from 'react';
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { FlashcardCollection } from '/imports/db/FlashcardCollection';
import { Master } from './Master';

export function StudyCollection({ collectionId }) {
  let [currentCard, setCurrentCard] = useState(null);
  let [currentCardIndex, setCurrentCardIndex] = useState(-1);
  let [flipped, setFlipped] = useState(false);
  let [ended, setEnded] = useState(false);

  let { summary, flashcards } = useTracker(() => {
    const collection = FlashcardCollection.find({_id: collectionId}).fetch()[0];
    return {
      summary: collection.summary,
      flashcards: collection.flashcards
    }
  });

  useEffect(() => {
    nextCard();
  }, []);

  function nextCard() {
    if (flashcards[currentCardIndex+1]) {
      setCurrentCard(flashcards[currentCardIndex+1]);
      setCurrentCardIndex(currentCardIndex+1);
    } else {
      setEnded(true);
    }
  }

  function sendReview(review) {
    nextCard();
  }

  return <Row className="mt-5">
    <Col lg="8" className="mx-auto">
      <Row className="align-items-center">
        { !ended ?
          <>
            <Col sm="5">
            { currentCard && <Master front={currentCard.front} back={currentCard.back} flipped={flipped} /> }
            </Col>
            <Col sm="6">
              <ButtonGroup className="w-100">
                <Button variant="success" onClick={() => sendReview('easy')}>Easy</Button>
                <Button onClick={() => sendReview('good')}>Good</Button>
                <Button variant="warning" onClick={() => sendReview('hard')}>Hard</Button>
                <Button variant="danger" onClick={() => sendReview('again')}>Again</Button>
              </ButtonGroup>
            </Col>
          </>
        : 'No more to study.'}
      </Row>
    </Col>
  </Row>
}