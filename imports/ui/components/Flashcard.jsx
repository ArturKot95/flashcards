import React, { useState, useRef, useEffect } from 'react';
import {
  Ref,
  Card,
  Form,
  Icon,
  Divider,
  Button,
  Header,
  Flag
} from 'semantic-ui-react';
import './Flashcard.css';
import useOuterClick from '/imports/hooks/useOuterClick';

export default function Flashcard({data: {front, back, _id}, onSelect, editable = true}) {
  let [editMode, setEditMode] = useState(false);
  let [newFront, setNewFront] = useState(front);
  let [newBack, setNewBack] = useState(back);
  let frontInputRef = useRef();
  let cardRef = useOuterClick(() => {
    if (editMode) onEdit();
  });

  useEffect(() => {
    if (editMode) {
      frontInputRef.current.querySelector('input').select();
    }
  }, [editMode]);

  function onEdit() {
    let frontText = newFront.trim();
    let backText = newBack.trim();

    if (frontText && backText) {
      Meteor.call('flashcard.edit', _id, { front: frontText, back: backText });
      setEditMode(false);
    }
  }

  return <Ref innerRef={editMode ? cardRef : null}>
    <Card>
      <Card.Content>
        {editMode ? 
          <Form onSubmit={(e) => {onEdit(); e.preventDefault();}} className="flashcard-editform">
            <Ref innerRef={frontInputRef}>
              <Form.Input type="text" label="Front" value={newFront} onChange={(e) => setNewFront(e.target.value)} />
            </Ref>

            <Divider />
            <Form.Input type="text" label="Back" value={newBack} onChange={(e) => setNewBack(e.target.value)} />
            
            <Button type="submit" style={{display: 'none'}}>edit</Button>
          </Form>
        :
          <>
            <div>
              <div className="flashcard-front">
                <div className="flashcard-language front">
                  <Flag name="uk"/>  
                </div>
                <Header className="flashcard-front">{front}</Header>
              </div>

              <Divider />

              <div className="flashcard-back">
                <div className="flashcard-language back">
                  <Flag name="germany"/>  
                </div>
                <Header className="flashcard-back">{back}</Header>
              </div>
            </div>
          </>
        }
      </Card.Content>
    </Card>
  </Ref>
}
