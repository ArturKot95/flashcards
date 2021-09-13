import React, { useState, useEffect } from 'react';
import {
  Grid,
  Header,
  Card,
  Button
} from 'semantic-ui-react';
import './LearnPage.css';

export default function LearnPage({ flashcards, onFinish }) {
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
      Meteor.call('learn.getSummary', flashcards, function ( error, summary ) {
        setSummary(summary);
      });
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

  return <Grid>
    <Grid.Column width={6}>
      { currentCard ? 
        <>
          <Grid.Row style={{marginBottom: '2rem'}}>
            <Button size="tiny" onClick={onFinish}>Finish</Button>
            <Card fluid className="learnpage-card">  
              <Card.Content>
                <Card.Header textAlign="center"> {currentCard.front} </Card.Header>
              </Card.Content>
            </Card>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Button.Group>
                <Button color="green" onClick={() => addReview('easy')}>Easy</Button>
                <Button color="olive" onClick={() => addReview('good')}>Good</Button>
                <Button color="orange" onClick={() => addReview('hard')}>Hard</Button>
                <Button color="red" onClick={() => addReview('again')}>Again</Button>
              </Button.Group>
            </Grid.Column>
            
          </Grid.Row>
        </>
      :
        <Header size="huge">You are up to date.</Header>
      }
    </Grid.Column>
  </Grid>
}