import React, { useState, useEffect } from 'react';
import './AppHeader.css';
import { Grid, Header, Container, Button, Menu } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import Collections from '/imports/db/Collections';
import NewCollectionModal from './modals/NewCollectionModal';

export default function AppHeader() {
  let [modalOpen, setModalOpen] = useState(false);
  let history = useHistory();
  let [activeLink, setActiveLink] = useState(history.location.pathname);

  const collections = useTracker(() => Collections.find({}, {
    fields: { _id: 1, name: 1 }
  }).fetch());

  useEffect(() => {
    history.listen(function () {
      setActiveLink(history.location.pathname);
    });
  }, []);

  return <Container id="appheader">
    <Menu>
      <Menu.Item header>Flashcards</Menu.Item>
      { collections.map(c => (
        <Menu.Item 
          key={c._id}
          name={c.name}
          onClick={() => history.push(`/collections/${c._id}`)}
          active={activeLink === `/collections/${c._id}`}
        />
      )) }
      <Menu.Menu position="right">
        <Menu.Item name="New Collection" onClick={() => setModalOpen(true)} />
      </Menu.Menu>
    </Menu>
    

    

    <NewCollectionModal open={modalOpen} onClose={() => setModalOpen(false)} onOpen={() => setModalOpen(true)} />
  </Container>
}