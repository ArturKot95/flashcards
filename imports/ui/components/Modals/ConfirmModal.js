import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export function ConfirmModal(props) {
  let [show, setShow] = useState(true);

  function onConfirm() {
    setShow(false);
    props.onConfirm();
  }

  function onReject() {
    setShow(false);
    props.onReject();
  }

  return <Modal show={show} backdrop="static">
    <Modal.Header>
      <Modal.Title>{ props.title || 'Confirm' }</Modal.Title>
    </Modal.Header>

    { props.description &&
      <Modal.Body>
        { props.description }
      </Modal.Body>
    }

    <Modal.Footer>
      <Button variant="secondary" onClick={onReject}>
        { props.rejectButtonText || 'Cancel' }
      </Button>
      <Button onClick={onConfirm}>
        { props.confirmButtonText || 'Confirm' }
      </Button>
    </Modal.Footer>
  </Modal>
}