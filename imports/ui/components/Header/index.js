import React, { useState } from 'react';
import { Navbar, Container, Button, Nav } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { FlashcardCollection } from '/imports/db/FlashcardCollection';
import { Link } from 'react-router-dom';
import './header.css';
import { NewCollectionModal } from '../Modals/NewCollectionModal';

export function Header(props) {
  let [showModal, setShowModal] = useState(false);

  const collections = useTracker(() => 
    FlashcardCollection.find({}).fetch()
  );

  return <Navbar className="bg-light">
    <Container>
      <Navbar.Brand>
        Flashcards
      </Navbar.Brand>
      <Navbar.Toggle/>

      <Navbar.Collapse>
        <Nav className="me-auto collection-links">
          { collections.map(c => 
              <Nav.Item key={c._id} className="me-3">
                <Link to={`/collections/${c._id}`}>{ c.name }</Link>
              </Nav.Item>
            ) 
          }
        </Nav>

        <Button variant="success" onClick={() => setShowModal(true)}>
          <i className="bi bi-file-plus-fill"></i> Collection
        </Button>
        <NewCollectionModal show={showModal} onHide={() => setShowModal(false)}/>
      </Navbar.Collapse>

    </Container>
  </Navbar>
}