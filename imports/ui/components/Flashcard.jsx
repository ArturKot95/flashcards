import React, { useState, useRef, useEffect } from 'react';
import {
  Ref,
  Card,
  Form,
  Icon,
  Divider,
  Button,
  Header,
  Flag,
  Dropdown,
  Checkbox,
  Label,
  Segment
} from 'semantic-ui-react';
import './Flashcard.css';
import FlashcardLevel from './FlashcardLevel'
import useOuterClick from '/imports/hooks/useOuterClick';
import { $ } from 'meteor/jquery';

export default function Flashcard({flashcard, onCheckboxChange, onRemove, onEdit, selected, editable = true, ...otherProps}) {
  let [editMode, setEditMode] = useState(false);
  let [hover, setHover] = useState(false);
  let [newFront, setNewFront] = useState(flashcard.front);
  let [newBack, setNewBack] = useState(flashcard.back);
  let frontInputRef = useRef();
  let cardRef = useOuterClick((e) => {
    if (editMode) editFlashcard();
  }, 'mousedown');

  useEffect(() => {
    $(cardRef.current).hover(
      () => setHover(true),
      () => setHover(false)
    );
  }, []);

  useEffect(() => {
    if (editMode) {
      frontInputRef.current.querySelector('input').select();
    }
  }, [editMode]);

  function editFlashcard() {
    let frontText = newFront.trim();
    let backText = newBack.trim();

    if (frontText && backText) {
      Meteor.call('flashcard.edit', flashcard._id, { front: frontText, back: backText });
      setEditMode(false);
      onEdit(flashcard._id, { front: frontText, back: backText });
    }
  }

  function removeFlashcard() {
    Meteor.call('flashcard.remove', flashcard._id);
    onRemove(flashcard);
  }

  function checkboxChangeHandler(input) {
    onCheckboxChange(flashcard, input.checked);
  }

  return <Ref innerRef={cardRef}>
      <Card className={`flashcard ${selected ? 'selected' : ''} ${otherProps.className}`}>
        <Card.Content>
          { (hover || selected) && <Checkbox className="flashcard-checkbox" 
            checked={selected} onChange={(e, input) => checkboxChangeHandler(input)} /> }

          { hover &&
            <Dropdown item icon='dropdown' simple className="flashcard-dropdown">
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setEditMode(true)}>Edit</Dropdown.Item>
                <Dropdown.Item onClick={removeFlashcard}>Remove</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          }

          {editMode ? 
            <Form onSubmit={(e) => {editFlashcard(); e.preventDefault();}} className="flashcard-editform">
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
                    {/* <span className="flag-icon flag-icon-pl"></span> */}
                  </div>
                  <Header className="flashcard-front">{flashcard.front}</Header>
                </div>

                <Divider />

                <div className="flashcard-back">
                  <div className="flashcard-language back">
                    {/* <span className="flag-icon flag-icon-de"></span>   */}
                  </div>
                  <Header className="flashcard-back">{flashcard.back}</Header>
                </div>
              </div>
            </>
          }

          <Label.Group size="mini" className="flashcard-tags">
            <Label >animals</Label>
            <Label>A1</Label>
          </Label.Group>
          <FlashcardLevel reviews={flashcard.reviews} />
        </Card.Content>
      </Card>
  </Ref>
}
