import React, { useState } from 'react';
import { Random } from 'meteor/random';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FlashcardCollection } from '/imports/db/FlashcardCollection';
import { useHistory } from 'react-router';

export function NewCollectionModal(props) {
  let onHide = props.onHide || null;
  const history = useHistory();
  const { register, handleSubmit, reset } = useForm();

  async function onSubmit({ name }) {
    const _id = Random.id();
    await FlashcardCollection.insert({ _id, name });
    history.push(`/collections/${_id}`);
    reset();
    props.onHide();
  }

  return <Modal show={props.show} onHide={onHide} animation={false}>
    <Modal.Header>
      <Modal.Title>New collection</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name</label>
        <Form.Control autoFocus id="name" placeholder="E.g. English..."
          {...register('name', { required: true })} />
      </Form>
    </Modal.Body>

    <Modal.Footer>
      <Button onClick={onHide}>Close</Button>
      <Button variant="success" onClick={handleSubmit(onSubmit)}>Create</Button>
    </Modal.Footer>
  </Modal>
}