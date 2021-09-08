import React, { useState } from 'react';
import './AppHeader.css';
import { Grid, Header, Container, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import Collections from '/imports/db/Collections';
import NewCollectionModal from './modals/NewCollectionModal';

export default function AppHeader() {
  let [modalOpen, setModalOpen] = useState(false);

  const collections = useTracker(() => Collections.find({}, {
    fields: { _id: 1, name: 1 }
  }).fetch());

  return <Container id="appheader">
    <Grid>
      <Grid.Column>
        <a href="/"><Header size="large" style={{display: 'inline-block'}}>Flashcards</Header></a>
        <div className="appheader-collectionlinks">
          { collections.map(c => <Link key={c._id} className="collectionlink" to={`/collections/${c._id}`}>{c.name}</Link>) }
        </div>

        <Button size="small" className="newcollection-modal" onClick={() => setModalOpen(true)}>New</Button>
        
        <NewCollectionModal open={modalOpen} onClose={() => setModalOpen(false)} onOpen={() => setModalOpen(true)} />

      </Grid.Column>
    </Grid>
  </Container>
}