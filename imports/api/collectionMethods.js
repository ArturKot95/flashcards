import Collections from '/imports/db/Collections';
import { Random } from 'meteor/random';

Meteor.methods({
  'collection.new'(name) {
    let id = Random.id();
    Collections.insert({ _id: id, name });
    return id;
  },
  'collection.rename'(id, newName) {
    Collections.update({ _id: id }, { $set: { name: newName } });
  },
  'collection.remove'(id) {
    Collections.remove({ _id: id });
  }
});