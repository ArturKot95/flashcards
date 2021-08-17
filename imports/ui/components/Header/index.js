import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';

export function Header(props) {
  return <Navbar className="bg-light">
    <Container>
      <Navbar.Brand>
        Flashcards
      </Navbar.Brand>
      <Navbar.Toggle/>

      <Button variant="success"><i className="bi bi-file-plus-fill"></i> Collection</Button>
    </Container>
  </Navbar>
}