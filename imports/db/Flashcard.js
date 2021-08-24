import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Flashcard = new Mongo.Collection();

const schema = new SimpleSchema({
  collection: String,
  front: String,
  back: String
});

export { Flashcard, schema };
