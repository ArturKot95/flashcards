import { expect }  from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Flashcards } from '/imports/db/Flashcards';
import './flashcardsMethods';

describe('Flashcards', function() {
  let id;

  before(function () {
    resetDatabase();
  });

  it('Should create new flashcard', async function() {
    Meteor.call('flashcards.add', 'Test Collection', 'Good morning', 'Dzień dobry')
    const docs = await Flashcards.find({}).fetch();
    expect(docs[0]).to.not.be.undefined;
    expect(docs[0].front).equals('Good morning');
    expect(docs[0].back).equals('Dzień dobry');
    expect(docs[0].collection).equals('Test Collection');

    id = docs[0]._id;
    expect(id).to.not.be.null;
  });

  it('Should edit flashcard, both front and back', async function() {
    Meteor.call('flashcards.edit', id, { front: 'Goodbye', back: 'Do widzenia' });
    const doc = await Flashcards.find({}).fetch()[0];
    expect(doc.front).equals('Goodbye');
    expect(doc.back).equals('Do widzenia');
  });

  it('Should edit flashcard, back only', async function() {
    Meteor.call('flashcards.edit', id, { back: 'Auf wiedersehen' });
    const doc = await Flashcards.find({}).fetch()[0];
    expect(doc.front).equals('Goodbye');
    expect(doc.back).equals('Auf wiedersehen');
  })

  it('Should be able to change collection name', async function() {
    Meteor.call('flashcards.changeCollection', id, 'German flashcards');
    const doc = await Flashcards.find({}).fetch()[0];
    expect(doc.collection).equals('German flashcards')
  });

  it('Should remove flashcard', async function() {
    Meteor.call('flashcards.remove', id);
    const docs = await Flashcards.find({}).fetch();
    expect(docs).to.have.length(0);
  });
});