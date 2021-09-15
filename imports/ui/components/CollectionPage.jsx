import React, { useEffect, useRef, useState } from 'react';
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
  Checkbox,
  Menu,
  Ref
} from 'semantic-ui-react';
import Flashcard from './Flashcard.jsx';
import LearnPage from './LearnPage.jsx';
import { createSelectable, SelectableGroup } from 'react-selectable';

const SelectableFlashcard = createSelectable(Flashcard);

export default function CollectionPage({ collectionId }) {
  let [summary, setSummary] = useState(null);
  let [filterText, setFilterText] = useState('');
  let [newFlashcardFront, setNewFlashcardFront] = useState('');
  let newFlashcardFrontRef = useRef();
  let selectCheckboxRef = useRef();
  let [newFlashcardBack, setNewFlashcardBack] = useState('');
  let [showConfirm, setShowConfirm] = useState(false);
  let [renameCollectionMode, setRenameCollectionMode] = useState(false);
  let [learnMode, setLearnMode] = useState(false);
  let [selectedFlashcards, setSelectedFlashcards] = useState([]);
  let [flashcardsToLearn, setFlashcardsToLearn] = useState([]);

  const collection = useTracker(() => Collections.find(
    { _id: collectionId }, {sort: { 'flashcards.createdAt': 1 } }
  ).fetch()[0]);
  const collectionNames = useTracker(() => Collections.find({}, { fields: { _id: 1, name: 1 } }).fetch());

  let [displayedFlashcards, setDisplayedFlashcards] = useState(collection.flashcards);
  let [newCollectionName, setNewCollectionName] = useState(collection.name);

  useEffect(() => {
    fetchSummary();

    // if flashcard has been deleted or added, clear search
    setDisplayedFlashcards(collection.flashcards);
    setFilterText('');
  }, [collection.flashcards.length]);

  useEffect(() => {
    filter();
  }, [filterText]);

  function filter() {
    filterText = filterText.trim().toLowerCase();
    if (filterText.length >= 3) {
      setDisplayedFlashcards([
        ...displayedFlashcards.filter(f => {
          return (f.front.toLowerCase().includes(filterText) ||
                 f.back.toLowerCase().includes(filterText)) &&
                 selectedFlashcards.filter(sf => sf._id === f._id).length === 0;
        }),
        ...selectedFlashcards
      ]);
    } else {
      setDisplayedFlashcards(collection.flashcards);
    }
  }

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
      newFlashcardFrontRef.current.querySelector('input').focus();
    }
  }

  function selectFlashcard(f) {
    setSelectedFlashcards([f, ...selectedFlashcards]);
  }

  function deselectFlashcard(f) {
    setSelectedFlashcards(selectedFlashcards.filter(i => i._id !== f._id));
  }

  function removeCollection() {
    Meteor.call('collection.remove', collectionId);
    setShowConfirm(false);
  }

  function removeFlashcards() {
    selectedFlashcards.forEach(f => {
      Meteor.call('flashcard.remove', f._id);
    });

    setSelectedFlashcards([]);
  }

  function renameCollection() {
    if (newCollectionName.trim()) {
      Meteor.call('collection.rename', collectionId, newCollectionName, function (error) {
        setRenameCollectionMode(false);
      });
    }
  }

  function moveFlashcardsToCollection(newCollectionId) {
    selectedFlashcards.forEach(f => {
      Meteor.call('flashcard.moveToCollection', f._id, newCollectionId);
    });

    setSelectedFlashcards([]);
  }

  function learnFlashcards(flashcards) {
    setSelectedFlashcards([]);
    setFlashcardsToLearn(flashcards);
    setLearnMode(true);
  }

  function finishLearning() {
    fetchSummary();
    setFlashcardsToLearn([]);
    setLearnMode(false);
  }

  function onEdit(id, { front, back }) {
    setDisplayedFlashcards(displayedFlashcards.reduce((prev, current) => {
      return [...prev, current._id === id ? {...current, _id: id, front, back} : current];
    }, []));

    setFilterText('');
  }

  function onSelectCheckboxChange(e, value) {
    if (value.checked) {
      setSelectedFlashcards(displayedFlashcards);
    } else {
      setSelectedFlashcards([]);
    }
  }

  // function onSelection(ids) {
  //   setSelectedFlashcards(displayedFlashcards.filter(f => ids.includes(f._id)));``
  // }

  return <>
    {learnMode ?
      <LearnPage flashcards={flashcardsToLearn} onFinish={finishLearning} />
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
                  <Button
                    color="green" 
                    animated="fade"
                    onClick={() => learnFlashcards(collection.flashcards)}
                    disabled={summary && (summary.due + summary.learning + summary.overdue === 0)}>
                      <Button.Content visible>Learn</Button.Content>
                      <Button.Content hidden><Icon name="book" /></Button.Content>
                  </Button>
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
          <Grid.Column width={8}>
            <Button.Group size="small">
              <Button onClick={() => selectCheckboxRef.current.querySelector('input[type="checkbox"]').click()}>
                <Ref innerRef={selectCheckboxRef}>
                  <Checkbox
                  onChange={(e, value) => onSelectCheckboxChange(e, value)}
                  indeterminate={selectedFlashcards.length > 0 && selectedFlashcards.length < displayedFlashcards.length}
                  checked={(selectedFlashcards.length === displayedFlashcards.length) && displayedFlashcards.length > 0}/>
                </Ref>
              </Button>
              { !!selectedFlashcards.length &&
                <>
                  <Button 
                    color="green"
                    onClick={() => learnFlashcards(selectedFlashcards)}
                    >
                    Learn Selected
                  </Button>
                  <Dropdown floating text='Move to' button>
                    <Dropdown.Menu>
                      { collectionNames.filter(c => c._id !== collectionId).map(c => (
                        <Dropdown.Item key={c._id} onClick={() => moveFlashcardsToCollection(c._id)}>
                          <Icon name="list alternate" />
                          { c.name }
                        </Dropdown.Item>
                      ))}
                      
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button 
                    disabled={selectedFlashcards.length === 0} 
                    onClick={removeFlashcards}
                  >Remove</Button>
                </>
              }
            </Button.Group>
          </Grid.Column>

          <Grid.Column floated="right" width={4}>
            <Input 
              icon="search"
              fluid 
              size="small"
              placeholder={`Filter ${collection.name}...`}
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </Grid.Column>
        </Grid>

        {/* <SelectableGroup 
         onSelection={onSelection}
         onNonItemClick={(e) => onNonItemClick(e)}
         tolerance={100} 
         > */}
          <Grid>
            <Grid.Column width={4}>
              <Card className="collectionpage-newcard">
                <Card.Content>
                  <Header size="tiny">New Card</Header>

                  <Form onSubmit={(e) => {newFlashcard(); e.preventDefault();}}>
                    <Ref innerRef={newFlashcardFrontRef}>
                      <Form.Input type="text" label="Front" 
                        placeholder="Type word / sentence..."
                        value={newFlashcardFront} onChange={(e) => setNewFlashcardFront(e.target.value)} />
                    </Ref>
                    <Form.Input type="text" label="Back" 
                      labelPosition="right"
                      placeholder="Type translation..."
                      value={newFlashcardBack} onChange={(e) => setNewFlashcardBack(e.target.value)}>
                      <input />
                      <Label color="blue" as="a" onClick={newFlashcard}>Add</Label>
                    </Form.Input>
                    <Form.Input type="submit" style={{display: 'none'}} />
                  </Form>

                </Card.Content>
              </Card>
            </Grid.Column>
            
              { displayedFlashcards.map(f => (
                <Grid.Column width={4} key={f._id}>
                    <Flashcard
                      selectableKey={f._id}
                      flashcard={f}
                      onEdit={(id, data) => onEdit(id, data)}
                      onRemove={(f) => deselectFlashcard(f)}
                      selected={!!selectedFlashcards.filter(i => i._id === f._id).length}
                      onCheckboxChange={(f, checked) => checked ? selectFlashcard(f) : deselectFlashcard(f)} />
                </Grid.Column>
              )) }
          </Grid>
        {/* </SelectableGroup> */}
      </>
    }
  </>
}