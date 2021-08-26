import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import SimpleSchema from 'simpl-schema';

const Collections = new Mongo.Collection('flashcard_collections');

const schema = new SimpleSchema({
  name: String,
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) return new Date();
    }
  },
  flashcards: {
    type: Array,
    defaultValue: []
  },
  'flashcards.$': new SimpleSchema({
    _id: String,
    front: String,
    back: String,
    createdAt: Date,
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
  }),
});

Collections.attachSchema(schema);

export { Collections, schema };
