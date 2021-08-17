import React from 'react';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

export function CollectionToolbar({ active, onRemove }) {
  return <ButtonToolbar className="my-2 mb-3">
    <ButtonGroup size="sm">
      <Button disabled={!active} variant="danger" onClick={onRemove}>
        <i className="bi bi-trash me-1"></i>Remove
      </Button>
    </ButtonGroup>
  </ButtonToolbar>
}