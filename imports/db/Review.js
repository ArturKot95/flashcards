import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/*
  Collection for storing reviews after learning flashcards,
  used by DolphinSR and spaced repetitions algorithms.
*/
const Review = new Mongo.Collection('review');

const schema = new SimpleSchema({
  master: String,
  combination: Object,
  ts: Date,
  rating: String
});

Review.attachSchema(schema);

export {
  Review,
  schema
}