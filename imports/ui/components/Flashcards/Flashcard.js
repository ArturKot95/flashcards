import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Button, Form, ButtonGroup } from 'react-bootstrap';
import { Flip } from './Flip';
import './Flashcard.css';

export function Flashcard(props) {
  let [flipped, setFlipped] = useState(false);
  let [checked, setChecked] = useState(false);
  let [showToolbar, setShowToolbar] = useState(false);

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

  return <div 
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
        <Button size="sm" variant="outline-primary">
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