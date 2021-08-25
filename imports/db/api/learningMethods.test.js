import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import '/imports/db/factories';
import { Factory } from 'meteor/dburles:factory';
import { Flashcards } from '/imports/db/Flashcards';
import { instanceManager } from '/server/dolphinsr';
import './learningMethods';

describe('Learning flashcards', function() {
  let flashcards;
  let instanceId;

  before(function () {
    resetDatabase();

    for (let i = 0; i < 10; i++) {
      Factory.create('flashcard', { 
        front: `front ${i+1}`,
        back: `back ${i+1}`
       });
    }
  });

  it('Should be 10 cards in Test Collection', async function () {
    const docs = Flashcards.find({ collection: 'Test Collection' }).fetch();
    expect(docs).to.have.length(10);
    expect(docs[0].front).to.equals('front 1');
    expect(docs[0].back).to.equals('back 1');
    flashcards = docs;
  });

  it('Should create dolphin instance from "flashcards.learn" method', function () {
    instanceId = Meteor.call('flashcards.learn', flashcards);
    const instance = instanceManager.get(instanceId);
    expect(instance).to.not.be.undefined;
    expect(instanceId).to.not.be.undefined;
  });

  it('Should get first card by invoking nextCard()', function () {
    const instance = instanceManager.get(instanceId);
    let card = instance.nextCard();
    expect(card.front).to.be.not.null;
    expect(instance.summary().learning).equals(20);
  });

  describe('Adding reviews explicitly in dolphin instance', function () {
    after(function() {
      Flashcards.update({}, {$set: {reviews: []}});
    });

    let cards = [];

    it('Should add "again" review to collection and dolphin instance', async function () {
      const instance = instanceManager.get(instanceId);
      let card = instance.nextCard();
      cards.push(card);
      const review = {
        ts: new Date(),
        master: card.master,
        combination: card.combination,
        rating: 'again'
      };
      instance.addReviews(review);
      await Flashcards.update({_id: card.master}, {$push: {
        reviews: review
      }});
   
      expect(instance.summary().learning).equals(20);
    });

    it('Should get next card from instance by invoking "sessions.nextCard" method', function () {
      let card = Meteor.call('learning.nextCard', instanceId);
      expect(card).to.not.be.undefined;
    })

    it('Should add "easy" review to collection and dolphin instance', async function () {
      const instance = instanceManager.get(instanceId);
      let card = instance.nextCard();
      cards.push(card);
      const review = {
        ts: new Date(),
        master: card.master,
        combination: card.combination,
        rating: 'easy'
      };
      instance.addReviews(review);
      await Flashcards.update({_id: card.master}, {$push: {
        reviews: review
      }});
  
      expect(instance.summary().learning).equals(19);
    });

    it('Should retrieve last "easy" review', function() {
      const card = Flashcards.find({_id: cards[1].master}).fetch()[0];
      expect(card.reviews[1].rating).to.equals('easy');
    });
  });

  describe('Adding reviews by methods', function() {
    after(function() {
      Flashcards.update({}, {$set: {reviews: []}});
    });

    let cards = [];

    const instance = instanceManager.get(instanceId);

    it('Should add "again" review to collection and dolphin instance', async function () {
      const card = Meteor.call('learning.nextCard', instanceId);
      cards.push(card);
      const review = {
        ts: new Date(),
        master: card.master,
        combination: card.combination,
        rating: 'again'
      };

      Meteor.call('learning.addReview', instanceId, card.master, review);
      const docs = await Flashcards.find({_id: card.master}).fetch()
      expect(docs[0].reviews).to.have.length(1);
      expect(docs[0].reviews[0].rating).equals('again');
    });
  });
});