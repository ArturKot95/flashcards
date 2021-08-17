import React from 'react';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

export function CollectionToolbar(props) {
  return <ButtonToolbar className="my-2">
    <ButtonGroup size="sm">
      <Button variant="danger"><i className="bi bi-trash me-1"></i>Remove</Button>
    </ButtonGroup>
  </ButtonToolbar>
}