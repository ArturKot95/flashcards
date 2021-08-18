import React, { useState } from 'react';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { ConfirmModal } from '/imports/ui/components';

export function CollectionToolbar({ active, onFlashcardRemove, onCollectionRemove }) {
  let [showConfirm, setShowConfirm] = useState(false);

  function onConfirm() {
    onCollectionRemove();
    setShowConfirm(false);
  }

  function onReject() {
    setShowConfirm(false);
  }

  return <ButtonToolbar className="my-2 mb-3">
    <ButtonGroup size="sm">
      <Button disabled={!active} variant="danger" onClick={onFlashcardRemove}>
        <i className="bi bi-trash me-1"></i>Remove
      </Button>
    </ButtonGroup>
    <Button size="sm" className="ms-auto" variant="secondary" 
      onClick={() => setShowConfirm(true)}>Remove Collection</Button>
    { showConfirm &&
      <ConfirmModal onConfirm={onConfirm} onReject={onReject} 
        description="Do you want to remove this collection?"/>
    }
  </ButtonToolbar>
}