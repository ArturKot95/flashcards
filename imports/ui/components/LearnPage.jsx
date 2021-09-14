import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Header,
  Card,
  Button,
  Reveal,
  Image
} from 'semantic-ui-react';
import './LearnPage.css';

export default function LearnPage({ flashcards, onFinish }) {
  let [instanceId, setInstanceId] = useState();
  let [currentCard, setCurrentCard] = useState(null);
  let currentCardRef = useRef(null);
  let [revealed, setRevealed] = useState(false);
  let [cardText, setCardText] = useState('');
  let [summary, setSummary] = useState(null);

  function revealCard() {
    if (currentCardRef.current && !revealed) {
      console.log(currentCardRef.current);
      setCardText(currentCardRef.current.back);
      setRevealed(true);
    }
  }

  useEffect(() => {
    Meteor.call('learn.start', flashcards, function (error, { id, summary }) {
      setInstanceId(id);
      setSummary(summary);
    });
  }, []);

  useEffect(() => {
    if (revealed) {
      document.addEventListener('keypress', function (e) {
        switch (e.key) {
          case '1':
            addReview('easy');
            break;
          case '2':
            addReview('good');
            break;
          case '3':
            addReview('hard');
            break;
          case '4':
            addReview('again');
            break;
        }
      });
    }
  }, [revealed]);

  useEffect(() => {
    if (instanceId) {
      nextCard();

      document.addEventListener('keypress', function (e) {
        if (e.key === ' ') {
          revealCard();
        }
      });

    }
  }, [instanceId]);

  function nextCard() {
    setRevealed(false);

    Meteor.call('learn.nextCard', instanceId, function (error, card) {
        setCurrentCard(card);
        currentCardRef.current = card;

        if (card) {
          setCardText(card.front);
        }
      Meteor.call('learn.getSummary', flashcards, function (error, summary) {
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

  function onKeyPress(e) {
    if (e.key === ' ') revealCard();
  }

  return <Grid centered>
    <Grid.Column width={5}>
      { currentCard ? 
        <>
          <Grid.Row style={{marginBottom: '2rem'}}>
            <Button size="tiny" onClick={onFinish}>Finish</Button>

            <Card>
              <Card.Content>
                <Card.Header>{ cardText }</Card.Header>
              </Card.Content>
            </Card>
              
          </Grid.Row>
          { revealed &&
            <Grid.Row>
              <Grid.Column>
                <Grid.Row style={{textAlign: 'center'}}>
                  <Grid.Column>
                    <Button.Group className="learnpage-reviewbuttons">
                      <Button color="green" onClick={() => addReview('easy')}>
                        Easy
                        <span className="learnpage-reviewshortcut">1</span>
                      </Button>
                      <Button color="olive" onClick={() => addReview('good')}>
                        Good
                        <span className="learnpage-reviewshortcut">2</span>
                      </Button>
                      <Button color="orange" onClick={() => addReview('hard')}>
                        Hard
                        <span className="learnpage-reviewshortcut">3</span>
                      </Button>
                      <Button color="red" onClick={() => addReview('again')}>
                        Again
                        <span className="learnpage-reviewshortcut">4</span>
                      </Button>
                    </Button.Group>
                  </Grid.Column>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          }
          
        </>
      :
        <Header size="huge" style={{textAlign: 'center'}}>
          You are up to date. 
          <Button onClick={onFinish}>Go to Collections</Button>
        </Header>
      }
    </Grid.Column>
  </Grid>
}