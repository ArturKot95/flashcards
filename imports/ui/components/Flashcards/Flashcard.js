import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Button, Form, ButtonGroup } from 'react-bootstrap';
import { Flip } from './Flip';
import { FlashcardWithForm } from './FlashcardWithForm';
import { FlashcardCollection } from '/imports/db/FlashcardCollection'
import './Flashcard.css';

export function Flashcard(props) {
  let [flipped, setFlipped] = useState(false);
  let [checked, setChecked] = useState(false);
  let [showToolbar, setShowToolbar] = useState(false);
  let [editMode, setEditMode] = useState(false);

  function mouseEnterHandler() {
    setFlipped(true);
    setShowToolbar(true);
  }

  function mouseLeaveHandler() {
    setFlipped(false);
    setShowToolbar(false);
  }

  useEffect(() => {
    if (checked) {
      props.onChecked && props.onChecked(props.flashcard);
    } else {
      props.onUnchecked && props.onUnchecked(props.flashcard);
    }
  }, [checked]);

  function onCardClick(e) {
    setChecked(!checked);
  }

  function onEditButtonClick(e) {
    setEditMode(true);
    e.stopPropagation();
  }

  async function editFlashcard(data) {
    const { front, back } = data;
    window.alert('edit');
    setEditMode(false);
  }

  return <>
  { editMode ?
    <FlashcardWithForm
      front={props.flashcard.front}
      back={props.flashcard.back}
      onSubmit={(data) => editFlashcard(data)}
      buttonText="Edit"
    />
  :
    <div 
      className="position-relative"
      onClick={(e) => onCardClick(e)}
      onMouseEnter={() => mouseEnterHandler()}
      onMouseLeave={() => mouseLeaveHandler()}
    >

      <div className="flashcard-toolbar"
          style={{display: showToolbar ? 'block' : 'none'}}>
        <ButtonGroup>
          <Button size="sm" variant="outline-primary">
            <Form.Check inline readOnly={true} checked={checked}/>
          </Button>
          <Button size="sm" variant="outline-primary" onClick={(e) => onEditButtonClick(e)}>
            <i className="bi bi-pencil-fill"></i>
          </Button>
        </ButtonGroup>
      </div>

      <Flip height={props.height || '200'} flipped={flipped} front={() => (
        <div className="flashcard-front d-flex align-items-center justify-content-center">
          <span className="display-6">{props.flashcard.front}</span>
        </div>
      )} back={() => (
        <div className="flashcard-back d-flex align-items-center justify-content-center">
          <span className="display-6">{props.flashcard.back}</span>
        </div>
      )}></Flip>

    </div>
  }
  </>;
}