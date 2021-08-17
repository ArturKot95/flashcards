import { Meteor } from 'meteor/meteor';
import { FlashcardCollection } from '/imports/db/FlashcardCollection';
import { Flashcard } from '/imports/db/Flashcard';

const exampleCollections = [
  {
    name: 'Test Collection 1',
    flashcards: [
      {
        front: 'front 1',
        back: 'back 1'
      }
    ]
  },
  {
    name: 'Test Collection 2',
    flashcards: [
      {
        front: 'front 2',
        back: 'back 2'
      }
    ]
  }
];

Meteor.startup(() => {
  if (FlashcardCollection.find({}).count() === 0) {
    exampleCollections.forEach(collection => FlashcardCollection.insert(collection));
  }
});