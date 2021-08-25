import { Meteor } from 'meteor/meteor';
import { Flashcards } from '/imports/db/Flashcards';

Meteor.methods({
  'flashcards.add'(collection, front, back) {
    Flashcards.insert({
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

    Flashcards.update({ _id }, { $set: change });
  },
  'flashcards.changeCollection'(_id, newCollection) {
    Flashcards.update({_id}, { 
      $set: {
        collection: newCollection
      }
    });
  }
});