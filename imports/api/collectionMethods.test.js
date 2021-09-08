import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import Collections from '/imports/db/Collections';
import './collectionMethods';

describe('Collections', function () {
  let collectionId;

  before(function () {
    resetDatabase();
  });

  it('Should create new collection', function () {
    collectionId = Meteor.call('collection.new', 'Test');
    let collection = Collections.find({ name: 'Test' }).fetch()[0];
    expect(collection).to.not.be.undefined;
  });

  it('Should be able to change name of collection', function () {
    Meteor.call('collection.rename', collectionId, 'German');
    let collection = Collections.find({ _id: collectionId }).fetch()[0];
    expect(collection.name).to.equal('German');
  });

  it('Should remove the collection', function () {
    Meteor.call('collection.remove', collectionId);
    let docs = Collections.find({}).fetch();
    expect(docs).to.have.length(0);
  })
});