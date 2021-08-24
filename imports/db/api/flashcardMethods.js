import { Meteor } from 'meteor/meteor';
import { Flashcard } from '/imports/db/Flashcard';

Meteor.methods({
  'flashcards.add'(collection, front, back) {
    Flashcard.insert({
      collection,
      front,
      back
    });
  },
  'flashcards.remove'(_id) {
    Flashcards.remove({ _id });
  },
  'flashcards.edit'(_id, { front, back }) {
    let change = {};
    if (front) change.front = front;
    if (back) change.back = back;

    Flashcards.update({ _id }, change);
  },
  'flashcards.changeCollection'(_id, newCollection) {
    Flashcards.update({_id}, { 
      collection: newCollection
    });
  }
});