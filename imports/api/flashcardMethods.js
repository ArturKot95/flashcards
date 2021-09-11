import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import Collections from '/imports/db/Collections';

Meteor.methods({
  'flashcard.new'(collectionId, front, back) {
    let id = Random.id();

    const flashcard = {
      _id: id,
      front,
      back,
      createdAt: new Date()
    };

    Collections.update({_id: collectionId}, {
      $push: {
        flashcards: flashcard
      }
    });

    return flashcard;
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
  async 'flashcard.edit'(_id, { front, back }) {
    let change = {};
    if (front) change['flashcards.$[element].front'] = front;
    if (back) change['flashcards.$[element].back'] = back;

    await Collections.rawCollection().updateMany({}, {
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