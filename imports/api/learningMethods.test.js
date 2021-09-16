import { Random } from 'meteor/random';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import '/imports/db/factories';
import { Factory } from 'meteor/dburles:factory';
import Collections from '/imports/db/Collections';
import { instanceManager } from '/server/dolphinsr';
import './learningMethods';

if (Meteor.isServer) {
describe('Learning flashcards', function() {
  let flashcards;
  let instanceId;

  before(async function () {
    Factory.create('collection');

    const { _id } = await Collections.find({name: 'Test'}).fetch()[0];

    for (let i = 0; i < 10; i++) {
      Collections.update({_id}, {
        $push: {
          flashcards: {
            _id: Random.id(),
            front: `front ${i+1}`,
            back: `back ${i+1}`,
            createdAt: new Date()
          }
        }
      });
    }
  });


  it('Should be 10 cards in Test collection', async function () {
    const doc = await Collections.find({ name: 'Test' }).fetch()[0];
    expect(doc.flashcards).to.have.length(10);
    expect(doc.flashcards[0].front).to.equals('front 1');
    expect(doc.flashcards[0].back).to.equals('back 1');
    flashcards = doc.flashcards;
  });

  it('Should create dolphin instance from "learn.start" method', function () {
    instanceId = Meteor.call('learn.start', flashcards).id;
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

      await Collections.update({'flashcards._id': card.master}, {
        $push: {
          'flashcards.$.reviews': review
        }
      });
   
      expect(instance.summary().learning).equals(20);
    });

    it('Should get next card from instance by invoking "learn.nextCard" method', function () {
      let card = Meteor.call('learn.nextCard', instanceId);
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
      await Collections.update({'flashcards._id': card.master}, {
        $push: {
          'flashcards.$.reviews': review
        }
      });
  
      expect(instance.summary().learning).equals(19);
    });

    it('Should retrieve last "easy" review', async function() {
      let doc = Collections.findOne({
        'flashcards._id': cards[1].master
      }, {
        fields: {
          flashcards: {
            $elemMatch: { _id: cards[1].master }
          }
        }
      });

      expect(doc.flashcards[0].reviews[1].rating).to.equals('easy');
    });
  });

  describe('Adding reviews by methods', function() {
    after(function() {
      resetDatabase();
    });

    it('Should add "again" review to collection and dolphin instance', async function () {
      const card = Meteor.call('learn.nextCard', instanceId);

      const review = {
        ts: new Date(),
        master: card.master,
        combination: card.combination,
        rating: 'again'
      };

      Meteor.call('learn.addReview', instanceId, card.master, review);

      let doc = Collections.findOne({ 'flashcards._id': card.master }, {
        fields: {
          flashcards: {
            $elemMatch: { _id: card.master }
          }
        }
      });
      expect(doc.flashcards[0].reviews).to.have.length(1);
      expect(doc.flashcards[0].reviews[0].rating).equals('again');
    });
  }); 
});
}