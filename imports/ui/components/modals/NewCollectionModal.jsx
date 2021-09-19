import React, { useState } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';

export default function NewCollectionModal({ open, onClose, onOpen }) {
  let [name, setName] = useState('');

  function onCreate() {
    if (name.trim()) {
      Meteor.call('collection.new', name.trim());
      
      onClose();
      setName('');
    }
  }

  return <Modal
    onClose={() => onClose()}
    onOpen={() => onOpen()}
    open={open}
    size="tiny"
  >
    <Modal.Header>New Collection</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <Form onSubmit={(e) => {onCreate(); e.preventDefault();}}>
          <Form.Input value={name} onChange={(e) => setName(e.target.value)}
               autoFocus label="Name" fluid placeholder="e.g. German..." />
        </Form>
      </Modal.Description>
    </Modal.Content>
    <Modal.Actions>
      <Button color='black' onClick={() => onClose()}>
        Close
      </Button>
      <Button
        content="Create"
        labelPosition='right'
        icon='checkmark'
        onClick={() => onCreate()}
        positive
      />
    </Modal.Actions>
  </Modal>
}