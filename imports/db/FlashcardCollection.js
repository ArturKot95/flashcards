import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { schema as FlashcardSchema } from './Flashcard';

const FlashcardCollection = new Mongo.Collection('collections');

const schema = new SimpleSchema({
  _id: { type: String },
  summary: {
    type: Object,
    optional: true
  },
  name: { type: String },
  flashcards: {
    type: Array,
    defaultValue: []
  },
  'flashcards.$': FlashcardSchema,
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
    }
  }
});

FlashcardCollection.attachSchema(schema);

export {
  FlashcardCollection,
  schema
}