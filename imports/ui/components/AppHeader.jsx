import React from 'react';
import './AppHeader.css';
import { Grid, Header, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import Collections from '/imports/db/Collections';

export default function AppHeader() {
  const collections = useTracker(() => Collections.find({}, {
    fields: { _id: 1, name: 1 }
  }).fetch());

  return <Container>
    <Grid>
      <Grid.Column>
        <Header size="large" style={{display: 'inline-block'}}>Flashcards</Header>
        <div className="appheader-collectionlinks">
          { collections.map(c => <Link key={c._id} className="collectionlink" to={`/collections/${c._id}`}>{c.name}</Link>) }
        </div>
      </Grid.Column>
    </Grid>
  </Container>
}