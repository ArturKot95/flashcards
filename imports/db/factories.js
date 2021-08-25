import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import { Flashcards } from './Flashcards';

Factory.define('flashcard', Flashcards, {
  front: faker.lorem.word(),
  back: faker.lorem.word(),
  collection: 'Test Collection'
});
