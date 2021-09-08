import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import Collections from '/imports/db/Collections';
import {
  Header,
  Grid,
  Label,
  Confirm
} from 'semantic-ui-react';
import Flashcard from './Flashcard.jsx';

export default function CollectionPage({ collectionId }) {
  let [showConfirm, setShowConfirm] = useState(false);
  const collection = useTracker(() => Collections.find({ _id: collectionId }).fetch()[0]);

  function removeCollection() {
    Meteor.call('collection.remove', collectionId);
    setShowConfirm(false);
  }

  return <>
    <Confirm
      open={showConfirm}
      closeOnDocumentClick
      content="Do you want to remove this collection?"
      size="tiny"
      confirmButton="Remove"
      onConfirm={removeCollection}
      onCancel={() => setShowConfirm(false)}
    />

    <Header size="huge">
      {collection.name}
      <Label style={{cursor: 'pointer'}} 
        color="red" size="mini" onClick={() => setShowConfirm(true)}>
          Remove Collection
        </Label>
    </Header>
    <Grid>
      { collection.flashcards.map(f => (
        <Grid.Column width={4} key={f._id}>
          <Flashcard data={f} />
        </Grid.Column>
      )) }
    </Grid>
  </>
}