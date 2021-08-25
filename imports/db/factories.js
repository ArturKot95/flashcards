import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import { Flashcard } from './Flashcard';

Factory.define('flashcards', Flashcard, {
  front: faker.lorem.word(),
  back: faker.lorem.word(),
  collection: 'Test Collection'
});
