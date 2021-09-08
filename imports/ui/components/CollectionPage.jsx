import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import Collections from '/imports/db/Collections';
import {
  Header,
  Grid
} from 'semantic-ui-react';
import Flashcard from './Flashcard.jsx';

export default function CollectionPage({ collectionId }) {
  const collection = useTracker(() => Collections.find({ _id: collectionId }).fetch()[0]);

  return <>
    <Header size="huge">{collection.name}</Header>
    <Grid>
      { collection.flashcards.map(f => (
        <Grid.Column width={4} key={f._id}>
          <Flashcard data={f} />
        </Grid.Column>
      )) }
    </Grid>
  </>
}