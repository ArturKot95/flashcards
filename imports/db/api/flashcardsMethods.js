import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Collections } from '/imports/db/Collections';

Meteor.methods({
  'flashcard.add'(collectionId, front, back) {
    Collections.update({_id: collectionId}, {
      $push: {
        flashcards: {
          _id: Random.id(),
          front,
          back,
          createdAt: new Date()
        }
      }
    });
  },
  'flashcard.remove'(_id) {
    Collections.update({}, {
      $pull: {
        flashcards: { _id }
      }
    }, {
      multi: true
    });
  },
  'flashcard.edit'(_id, { front, back }) {
    let change = {};
    if (front) change['flashcards.$[element].front'] = front;
    if (back) change['flashcards.$[element].back'] = back;

    Collections.rawCollection().updateMany({}, {
      $set: change
    }, {
      arrayFilters: [
        {
          "element._id": _id
        }
      ]
    })
  },
  'flashcard.moveToCollection'(_id, collectionId) {
    const doc = Collections.findOne({ 'flashcards._id': _id }, {
      fields: { flashcards: {
        $elemMatch: { _id }
      }}
    });

    let flashcard = doc.flashcards[0];
    Collections.update({}, {
      $pull: {
        flashcards: { _id }
      }
    });

    Collections.update({_id: collectionId}, {
      $push: {
        flashcards: flashcard
      }
    });
  }
});