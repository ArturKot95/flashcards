import { Meteor } from 'meteor/meteor';
import { FlashcardCollection } from '/imports/db/FlashcardCollection';

Meteor.methods({
  'flashcard.edit': async (id, {front, back}) => {
    FlashcardCollection.rawCollection().updateMany({}, {
      $set: {
        "flashcards.$[element].front": front,
        "flashcards.$[element].back": back
      }
    }, {
      arrayFilters: [
        {
          "element._id": id
        }
      ]
    })
  }
});