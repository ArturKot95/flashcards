import React from 'react';
import { Navbar, Container, Button, Nav } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { FlashcardCollection } from '/imports/db/FlashcardCollection';
import { Link } from 'react-router-dom';
import './header.css';

export function Header(props) {
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

        <Button variant="success"><i className="bi bi-file-plus-fill"></i> Collection</Button>
      </Navbar.Collapse>

    </Container>
  </Navbar>
}