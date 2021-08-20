import React, { useState } from 'react';
import { Flip } from '../Flashcards/Flip';
import '../Flashcards/Flashcard.css';

export function Master({ flipped, height, front, back }) {
  let [f, setF] = useState(flipped);
  
  return <div onClick={() => setF(!f)}>
    <Flip height={height || '200'} flipped={f} front={() => (
        <div className="flashcard-front d-flex align-items-center justify-content-center">
          <span className="display-6">{front}</span>
        </div>
      )} back={() => (
        <div className="flashcard-back d-flex align-items-center justify-content-center">
          <span className="display-6">{back}</span>
        </div>
      )}>
    </Flip>
  </div>
}