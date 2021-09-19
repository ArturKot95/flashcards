import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Header,
  Card,
  Button
} from 'semantic-ui-react';
import './LearnPage.css';
import Summary from './Summary.jsx';

export default function LearnPage({ flashcards, onFinish }) {
  let [instanceId, setInstanceId] = useState();
  let instanceIdRef = useRef();
  let [currentCard, setCurrentCard] = useState(null);
  let currentCardRef = useRef(null);
  let [revealed, setRevealed] = useState(false);
  let revealedRef = useRef(false);
  let [cardText, setCardText] = useState('');
  let [summary, setSummary] = useState(null);

  function revealCard() {
    if (currentCardRef.current && !revealed) {
      setCardText(currentCardRef.current.back);
      setRevealed(true);
    }
  }

  useEffect(() => revealedRef.current = revealed, [revealed]);
  useEffect(() => instanceIdRef.current = instanceId, [instanceId]);

  useEffect(() => {
    Meteor.call('learn.start', flashcards, function (error, { id, summary }) {
      setInstanceId(id);
      setSummary(summary);
    });

    document.addEventListener('keypress', keyPressHandler);
  }, []);

  function keyPressHandler(e) {
    if (revealedRef.current) {
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
    }
  }

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

    Meteor.call('learn.nextCard', instanceIdRef.current, function (error, card) {
        setCurrentCard(card);
        currentCardRef.current = card;

        if (card) {
          setCardText(card.front);
        }
    });
  }

  function addReview(rating) {
    const review = {
      master: currentCardRef.current.master,
      combination: currentCardRef.current.combination,
      ts: new Date(),
      rating: rating
    };

    Meteor.call('learn.addReview', instanceIdRef.current, currentCardRef.current.master, review, function (error, summary) {
      setSummary(summary);
      nextCard();
    });
  }

  return <Grid centered>
    <Grid.Column width={5}>
      { currentCard ? 
        <>
          <Grid.Row style={{marginBottom: '2rem'}}>
            <Button size="tiny" onClick={onFinish}>Finish</Button>

            { summary &&
              <div style={{textAlign: 'center', marginTop: '1rem'}}>
                <Summary summary={summary} />
              </div>
            }

            <Card fluid className="learnpage-card" onClick={revealCard}>
              <Card.Content>
                <Card.Header textAlign="center">{ cardText }</Card.Header>
                {!revealed && <span className="learnpage-spacetoreveal">space to reveal</span>}
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