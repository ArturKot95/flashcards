import { expect }  from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import Collections from '/imports/db/Collections';
import './flashcardMethods';
import './tagMethods';

if (Meteor.isServer) {
  describe('Flashcards', function() {
    let collectionId;
    let flashcardId;
  
    before(function (done) {
      resetDatabase();
      Collections.insert({name: 'Test'}, (err, _id) => {
        collectionId = _id;
        flashcardId = Meteor.call('flashcard.new', collectionId, 'Good morning', 'Dzień dobry')._id;
        done();
      });
    });
  
    after(function () {
      resetDatabase();
    }); 
  
    it('Should create new flashcard', async function() {
      const doc = Collections.find({name: 'Test'}).fetch()[0];
      expect(doc.flashcards).to.have.length(1);
    });
  
    it('Should edit flashcard, both front and back', async function() {
      Meteor.call('flashcard.edit', flashcardId, { front: 'Goodbye', back: 'Do widzenia' });
      const doc = await Collections.find({_id: collectionId}).fetch()[0];
      expect(doc.flashcards[0].front).equals('Goodbye');
      expect(doc.flashcards[0].back).equals('Do widzenia');
    });
  
    it('Should edit flashcard, back only', async function() {
      Meteor.call('flashcard.edit', flashcardId, { back: 'Auf wiedersehen' });
      const doc = await Collections.find({_id: collectionId}).fetch()[0];
      expect(doc.flashcards[0].front).equals('Goodbye');
      expect(doc.flashcards[0].back).equals('Auf wiedersehen');
    })
  
    it('Should be able to change collection', function (done) {
      Collections.insert({name: 'Test 2'}, async (err, newCollectionId) => {
        Meteor.call('flashcard.moveToCollection', flashcardId, newCollectionId);
        const doc = await Collections.find({_id: newCollectionId}).fetch()[0];
  
        expect(doc.flashcards).to.have.length(1);
  
        // Switch back to first collection
        Meteor.call('flashcard.moveToCollection', flashcardId, collectionId);
  
        done();
      });
    });

    it('Should add tag "german" to flashcards', async function() {
      Meteor.call('flashcard.addTag', flashcardId, 'german');
      const doc = await Collections.find({ _id: collectionId }).fetch()[0];
      expect(doc.flashcards[0].tags[0]).to.equal('german');
    });

    it('Should prevent adding twice the same tag', async function () {
      Meteor.call('flashcard.addTag', flashcardId, 'german');
      const doc = await Collections.find({ _id: collectionId }).fetch()[0];
      expect(doc.flashcards[0].tags[0]).to.equal('german');
      expect(doc.flashcards[0].tags).to.have.length(1);
    });

    it('Should be able to rename tag from "german" to "french"', async function () {
      Meteor.call('tag.rename', 'german', 'french');
      const doc = await Collections.find({ _id: collectionId }).fetch()[0];
      expect(doc.flashcards[0].tags[0]).to.equal('french');
    });

    it('Should remove tag "german" from flashcard', async function() {
      Meteor.call('flashcard.removeTag', flashcardId, 'french');
      const doc = await Collections.find({ _id: collectionId }).fetch()[0];
      expect(doc.flashcards[0].tags).to.have.length(0);
    });
  
    it('Should remove flashcard', async function() {
      Meteor.call('flashcard.remove', flashcardId);
  
      const doc = await Collections.find({_id: collectionId}).fetch()[0];
      expect(doc.flashcards).to.have.length(0);
    });
  });
}