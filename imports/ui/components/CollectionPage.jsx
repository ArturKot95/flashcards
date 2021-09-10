import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import Collections from '/imports/db/Collections';
import {
  Header,
  Grid,
  Label,
  Confirm,
  Button,
  Dropdown,
  Input
} from 'semantic-ui-react';
import Flashcard from './Flashcard.jsx';

export default function CollectionPage({ collectionId }) {
  let [showConfirm, setShowConfirm] = useState(false);
  let [renameCollectionMode, setRenameCollectionMode] = useState(false);
  const collection = useTracker(() => Collections.find({ _id: collectionId }).fetch()[0]);
  let [newCollectionName, setNewCollectionName] = useState(collection.name);

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
        <Button.Group floated='right'>       
          <Button color="green">Learn</Button>       
          <Dropdown text="More" button>
            <Dropdown.Menu>
              <Dropdown.Item text="Rename" onClick={() => setRenameCollectionMode(true)}/>
              <Dropdown.Item text="Delete" onClick={() => setShowConfirm(true)}/>
            </Dropdown.Menu>
          </Dropdown>
        </Button.Group>
      </Grid.Column>
    </Grid>

    <Grid>
      { collection.flashcards.map(f => (
        <Grid.Column width={4} key={f._id}>
          <Flashcard data={f} />
        </Grid.Column>
      )) }
    </Grid>
  </>
}