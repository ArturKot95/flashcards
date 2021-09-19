import { Meteor } from 'meteor/meteor';

import '/imports/api/flashcardMethods';
import '/imports/api/tagMethods';
import '/imports/api/collectionMethods';
import '/imports/api/learningMethods';

import Collections from '/imports/db/Collections';

Meteor.startup(() => {
  const docs = Collections.find({}).fetch();
  if (docs.length === 0) {
    import './seed';
  }
});