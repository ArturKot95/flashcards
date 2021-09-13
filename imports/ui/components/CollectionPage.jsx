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
  Input,
  Segment,
  Menu
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
  let [selectedFlashcards, setSelectedFlashcards] = useState([]);

  const collection = useTracker(() => Collections.find(
    { _id: collectionId }, {sort: { 'flashcards.createdAt': 1 } }
  ).fetch()[0]);
  const collectionNames = useTracker(() => Collections.find({}, { fields: { _id: 1, name: 1 } }).fetch());

  let [newCollectionName, setNewCollectionName] = useState(collection.name);

  useEffect(() => {
    console.log(collectionNames)
    fetchSummary();
    collection.flashcards = [];
  }, [collection.flashcards.length]);

  function fetchSummary() {
    Meteor.call('learn.getSummary', collection.flashcards, function (error, summary) {
      setSummary(summary);
    });
  }

  function newFlashcard() {
    let front = newFlashcardFront.trim();
    let back = newFlashcardBack.trim();

    if (front && back) {
      Meteor.call('flashcard.new', collectionId, front, back);
      setNewFlashcardFront('');
      setNewFlashcardBack('');
    }
  }

  function selectFlashcard(id) {
    setSelectedFlashcards([id, ...selectedFlashcards]);
  }

  function deselectFlashcard(id) {
    setSelectedFlashcards(selectedFlashcards.filter(fId => id !== fId));
  }

  function removeCollection() {
    Meteor.call('collection.remove', collectionId);
    setShowConfirm(false);
  }

  function renameCollection() {
    if (newCollectionName.trim()) {
      Meteor.call('collection.rename', collectionId, newCollectionName, function (error) {
        setRenameCollectionMode(false);
      });
    }
  }

  function moveFlashcardsToCollection(newCollectionId) {
    if (selectedFlashcards.length) {
      selectedFlashcards.forEach(flashcardId => {
        Meteor.call('flashcard.moveToCollection', flashcardId, newCollectionId);
      });
    }
  }

  return <>
    {learnMode ?
      <LearnPage flashcards={collection.flashcards} onFinish={() => setLearnMode(false)} />
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

        <Segment className="collectionpage-segment">
          <Grid columns={2}>
            <Grid.Column>
              { renameCollectionMode ?
                <Input autoFocus fluid type="text" value={newCollectionName} action="Rename"
                  onChange={(e) => setNewCollectionName(e.target.value)} onBlur={renameCollection} />
              :
                <Header size="huge" className="collectionpage-header">
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
                  <Button color="green" onClick={() => setLearnMode(true)}
                          disabled={summary && (summary.due + summary.learning + summary.overdue === 0)}>Learn</Button>
                  <Dropdown floating className="button icon" trigger={<></>}>
                    <Dropdown.Menu>
                      <Dropdown.Item icon="pencil" text="Rename" onClick={() => setRenameCollectionMode(true)}/>
                      <Dropdown.Item icon="trash" text="Remove" onClick={() => setShowConfirm(true)}/>
                    </Dropdown.Menu>
                  </Dropdown>
                </Button.Group>
              </div>
            </Grid.Column>
          </Grid>
        </Segment>

        <Grid style={{marginTop: '1rem'}}>
          <Grid.Column>
            <Button.Group>
              <Button compact color="green" disabled={selectedFlashcards.length === 0}>Learn Selected</Button>
              <Dropdown floating compact text='Move to' button disabled={selectedFlashcards.length === 0}>
                <Dropdown.Menu>
                  { collectionNames.filter(c => c._id !== collectionId).map(c => (
                    <Dropdown.Item key={c._id} onClick={() => moveFlashcardsToCollection(c._id)}>
                      <Icon name="list alternate" />
                      { c.name }
                    </Dropdown.Item>
                  ))}
                  
                </Dropdown.Menu>
              </Dropdown>
              <Button compact color="red" disabled={selectedFlashcards.length === 0}>Remove</Button>
            </Button.Group>
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

          { collection.flashcards.map(f => (
            <Grid.Column width={4} key={f._id}>
              <Flashcard data={f}
                selected={selectedFlashcards.includes(f._id)}
                onCheckboxChange={(id, checked) => checked ? selectFlashcard(id) : deselectFlashcard(id)} />
            </Grid.Column>
          )) }
        </Grid>
      </>
    }
  </>
}