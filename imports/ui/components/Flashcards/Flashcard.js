import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Flip } from './Flip';
import './Flashcard.css';

export function Flashcard(props) {
  let [flipped, setFlipped] = useState(false);
  let [checked, setChecked] = useState(false);
  let cardRef = useRef();

  useEffect(() => {
    cardRef.current.addEventListener('mouseenter', () => {
      setFlipped(true);
    });
    cardRef.current.addEventListener('mouseleave', () => {
      setFlipped(false);
    });
  }, []);

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

  return <div className="position-relative" ref={cardRef} onClick={(e) => onCardClick(e)}>
    <Form.Check className="flashcard-checkbox" readOnly={true} checked={checked}/>
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