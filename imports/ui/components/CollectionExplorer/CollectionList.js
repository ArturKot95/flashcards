import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function CollectionList({ collections }) {
  return <ListGroup>
    { collections.map(c => (
      <ListGroupItem key={c._id}>
        <Link to={`/collections/${c._id}`}>{ c.name }</Link>
      </ListGroupItem>
    )) }
  </ListGroup>
}