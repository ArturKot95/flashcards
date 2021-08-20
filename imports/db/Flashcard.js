import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import SimpleSchema from 'simpl-schema';

const Flashcard = new Mongo.Collection('flashcards');
const schema = new SimpleSchema({
  _id: {
    type: String,
    autoValue: function () {
      if (this.isInsert) {
        return Random.id();
      }
    }
  },
  front: {
    type: String,
    optional: true
  },
  back: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
    }
  }
});

Flashcard.attachSchema(schema);

export {
  Flashcard,
  schema
}