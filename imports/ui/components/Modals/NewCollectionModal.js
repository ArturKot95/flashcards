import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FlashcardCollection } from '/imports/db/FlashcardCollection';

export function NewCollectionModal(props) {
  let onHide = props.onHide || null;
  const { register, handleSubmit, reset } = useForm();

  async function onSubmit({ name }) {
    await FlashcardCollection.insert({ name });
    reset();
    props.onHide();
  }

  return <Modal show={props.show} onHide={onHide}>
    <Modal.Header>
      <Modal.Title>New collection</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name</label>
        <Form.Control id="name" placeholder="E.g. English..."
          {...register('name', { required: true })} />
      </Form>
    </Modal.Body>

    <Modal.Footer>
      <Button onClick={onHide}>Close</Button>
      <Button variant="success" onClick={handleSubmit(onSubmit)}>Create</Button>
    </Modal.Footer>
  </Modal>
}