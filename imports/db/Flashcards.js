import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Flashcards = new Mongo.Collection('flashcards');

const schema = new SimpleSchema({
  collection: String,
  front: String,
  back: String,
  createdDate: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) return new Date();
    }
  },
  reviews: {
    type: Array,
    defaultValue: []
  },
  'reviews.$': new SimpleSchema({
    master: String,
    combination: {
      type: Object,
      blackbox: true
    },
    ts: Date,
    rating: String
  })
});

Flashcards.attachSchema(schema);

export { Flashcards, schema };
