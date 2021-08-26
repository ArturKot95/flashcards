import { Factory } from 'meteor/dburles:factory';
import { Collections } from './Collections';

Factory.define('collection', Collections, {
  name: 'Test'
});
