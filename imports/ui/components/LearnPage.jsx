import React, { useState, useEffect } from 'react';
import {
  Grid,
  Header,
  Card,
  Button
} from 'semantic-ui-react';

export default function LearnPage({ flashcards }) {
  let [instanceId, setInstanceId] = useState();
  let [currentCard, setCurrentCard] = useState(null);
  let [summary, setSummary] = useState(null);

  useEffect(() => {
    Meteor.call('learn.start', flashcards, function (error, { id, summary }) {
      setInstanceId(id);
      setSummary(summary);
    });
  }, []);

  useEffect(() => {
    if (instanceId) {
      nextCard();
    }
  }, [instanceId]);

  function nextCard() {
    Meteor.call('learn.nextCard', instanceId, function (error, card) {
      setCurrentCard(card);
    });
  }

  function addReview(rating) {
    const review = {
      master: currentCard.master,
      combination: currentCard.combination,
      ts: new Date(),
      rating: rating
    };

    Meteor.call('learn.addReview', instanceId, currentCard.master, review, function (error, summary) {
      setSummary(summary);
      nextCard();
    });
  }

  return <Grid verticalAlign="middle">
    <Grid.Column>
      { currentCard ? 
        <>
          <Grid.Row>
            <Card>  
              <Card.Content>
                <Card.Header> {currentCard.front} </Card.Header>
              </Card.Content>
            </Card>
          </Grid.Row>
          <Grid.Row>
            <Button.Group>
              <Button onClick={() => addReview('easy')}>Easy</Button>
              <Button onClick={() => addReview('good')}>Good</Button>
              <Button onClick={() => addReview('hard')}>Hard</Button>
              <Button onClick={() => addReview('again')}>Again</Button>
            </Button.Group>
          </Grid.Row>
        </>
      :
        <Header size="huge">You are up to date.</Header>
      }
    </Grid.Column>
  </Grid>
}