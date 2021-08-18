import React from 'react';
import { FlashcardWithForm } from './FlashcardWithForm';
import { FlashcardCollection } from '/imports/db/FlashcardCollection';
import { Random } from 'meteor/random';

export function NewFlashcard(props) {
  async function createFlashcard(data) {
    data._id = Random.id();
    data.createdAt = new Date();

    await FlashcardCollection.update({ _id: props.collectionId }, {
      $push: {
        flashcards: data
      }
    });
  }

  return <FlashcardWithForm
    buttonText="Add"
    onSubmit={(data) => createFlashcard(data)}
  />
}