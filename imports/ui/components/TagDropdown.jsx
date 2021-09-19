import React, { useEffect, useState } from 'react';
import {
  Dropdown,
  Form,
  Label,
  Icon,
  Checkbox
} from 'semantic-ui-react';
import Collections from '/imports/db/Collections';
import { useTracker } from 'meteor/react-meteor-data';
import _, { add } from 'lodash';
import './TagDropdown.css';

export default function TagDropdown({ callback, flashcards }) {
  let [open, setOpen] = useState(false);
  let [newTagInput, setNewTagInput] = useState('');
  const tags = useTracker(() => {
    const collections = Collections.find({}).fetch();
    return Array.from(new Set(_.flattenDeep(collections.map(c => c.flashcards.map(f => f.tags || [])))));
  });

  function onSubmit(e, tag) {
    addTag(tag);
    setNewTagInput('');
    callback();
    e.preventDefault();
  }

  function toggleTag(tag) {
    let tagMatchCount = flashcards.filter(f => f.tags && f.tags.includes(tag)).length;
    if (tagMatchCount < flashcards.length) addTag(tag)
    else removeTag(tag);
    callback();
  }

  function addTag(tag) {
    if (tag.trim()) {
      flashcards.forEach(f => Meteor.call('flashcard.addTag', f._id, tag));
    }
  }

  function removeTag(tag) {
    flashcards.forEach(f => Meteor.call('flashcard.removeTag', f._id, tag));
  }

  return <Dropdown 
    button 
    compact 
    text="Tag"
    open={open}
    onClick={() => setOpen(true)} onBlur={() => setOpen(false)}>
    <Dropdown.Menu>
      <Dropdown.Item onClick={() => {}}>
        Manage tags
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item>
        <Form onSubmit={(e) => onSubmit(e)}>
          <Form.Input type="text"
          labelPosition="right"
          placeholder="New tag..."
          size="small"
          value={newTagInput} onChange={(e) => setNewTagInput(e.target.value)}>
            <input />
            <Label color="blue" as="a" onClick={(e) => onSubmit(e, newTagInput)}>
              <Icon name="add" style={{margin: 'auto'}}/>
            </Label>
          </Form.Input>
        </Form>
      </Dropdown.Item>
      { tags.map(tag => {
        let tagMatchCount = flashcards.filter(f => f.tags && f.tags.includes(tag)).length;

        return <Dropdown.Item key={tag} onClick={() => toggleTag(tag)} style={{position: 'relative'}}>
          {tag}
          <Checkbox
            disabled
            className="tagdropdown-checkbox"
            indeterminate={tagMatchCount < flashcards.length && flashcards.length > 0 && tagMatchCount > 0}
            checked={tagMatchCount === flashcards.length && flashcards.length > 0}
          />
        </Dropdown.Item>
      })}
      { tags.length === 0 && <Dropdown.Item disabled>No tags.</Dropdown.Item> }
    </Dropdown.Menu>
  </Dropdown>;
}