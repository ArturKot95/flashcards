import React, { useEffect, useState } from 'react';
import './CollectionPage.css';
import { useTracker } from 'meteor/react-meteor-data';
import Collections from '/imports/db/Collections';
import {
  Header,
  Grid,
  Label,
  Confirm,
  Button,
  Dropdown,
  Form,
  Card,
  Divider,
  Icon,
  Input
} from 'semantic-ui-react';
import Flashcard from './Flashcard.jsx';
import LearnPage from './LearnPage.jsx';

export default function CollectionPage({ collectionId }) {
  let [summary, setSummary] = useState(null);
  let [newFlashcardFront, setNewFlashcardFront] = useState('');
  let [newFlashcardBack, setNewFlashcardBack] = useState('');
  let [showConfirm, setShowConfirm] = useState(false);
  let [renameCollectionMode, setRenameCollectionMode] = useState(false);
  let [learnMode, setLearnMode] = useState(false);
  const collection = useTracker(() => Collections.find({ _id: collectionId }).fetch()[0]);
  let [flashcards, setFlashcards] = useState([...collection.flashcards]);
  let [newCollectionName, setNewCollectionName] = useState(collection.name);

  useEffect(() => {
    fetchSummary();
  }, [flashcards]);

  function fetchSummary() {
    Meteor.call('learn.getSummary', flashcards, function (error, summary) {
      setSummary(summary);
    });
  }

  function newFlashcard() {
    let front = newFlashcardFront.trim();
    let back = newFlashcardBack.trim();

    if (front && back) {
      Meteor.call('flashcard.new', collectionId, front, back, function (error, flashcard) {
        if (!error) {
          setFlashcards([flashcard, ...flashcards]);
        }
      });
    }
  }

  function removeCollection() {
    Meteor.call('collection.remove', collectionId);
    setShowConfirm(false);
  }

  function renameCollection() {
    if (newCollectionName.trim()) {
      Meteor.call('collection.rename', collectionId, newCollectionName);
      setRenameCollectionMode(false);
    }
  }

  return <>
    {learnMode ?
      <LearnPage flashcards={flashcards} />
    :
      <>
        <Confirm
        open={showConfirm}
        closeOnDocumentClick
        header="Remove Collection"
        content={`Do you want to remove Collection "${collection.name}"`}
        size="tiny"
        confirmButton="Remove"
        onConfirm={removeCollection}
        onCancel={() => setShowConfirm(false)}
        />

        <Grid columns={2}>
          <Grid.Column>
            { renameCollectionMode ?
              <Input autoFocus fluid type="text" value={newCollectionName} action="Rename"
                onChange={(e) => setNewCollectionName(e.target.value)} onBlur={renameCollection} />
            :
              <Header size="huge">
                {collection.name}
              </Header>
            }
          </Grid.Column>
          <Grid.Column>
            <div style={{float: 'right'}}>
              { summary &&
                <div className="collectionsummary">
                  <span>Due: {summary.due}</span>
                  <span>Later: {summary.later}</span>
                  <span>Learning: {summary.learning}</span>
                  <span>Overdue: {summary.overdue}</span>
                </div>
              }
              
              <Button.Group>
                <Button color="green" onClick={() => setLearnMode(true)}>Learn</Button>
                <Dropdown text="More" button>
                  <Dropdown.Menu>
                    <Dropdown.Item text="Rename" onClick={() => setRenameCollectionMode(true)}/>
                    <Dropdown.Item text="Delete" onClick={() => setShowConfirm(true)}/>
                  </Dropdown.Menu>
                </Dropdown>
              </Button.Group>
            </div>
          </Grid.Column>
        </Grid>

        <Grid>
          <Grid.Column width={4}>
            <Card>
              <Card.Content>
                <Header size="tiny">New Card</Header>

                <Form onSubmit={(e) => {newFlashcard(); e.preventDefault();}}>
                  <Form.Input type="text" label="Front" 
                    value={newFlashcardFront} onChange={(e) => setNewFlashcardFront(e.target.value)} />
                  <Form.Input type="text" label="Back" labelPosition="right"
                    value={newFlashcardBack} onChange={(e) => setNewFlashcardBack(e.target.value)}>
                    <input />
                    <Label color="blue" as="a" onClick={newFlashcard}>Add</Label>
                  </Form.Input>
                  <Form.Input type="submit" style={{display: 'none'}} />
                </Form>

              </Card.Content>
            </Card>
          </Grid.Column>

          { flashcards.map(f => (
            <Grid.Column width={4} key={f._id}>
              <Flashcard data={f} />
            </Grid.Column>
          )) }
        </Grid>
      </>
    }
  </>
}