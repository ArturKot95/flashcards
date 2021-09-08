const id1 = Meteor.call('collection.new', 'German');
const id2 = Meteor.call('collection.new', 'English');

Meteor.call('flashcard.new', id1, 'front 1', 'back 1');
Meteor.call('flashcard.new', id1, 'front 2', 'back 2');
Meteor.call('flashcard.new', id1, 'front 3', 'back 3');

Meteor.call('flashcard.new', id2, 'front 1', 'back 1');
Meteor.call('flashcard.new', id2, 'front 2', 'back 2');
Meteor.call('flashcard.new', id2, 'front 3', 'back 3');