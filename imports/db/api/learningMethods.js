import { instanceManager, convertToMaster } from '/server/dolphinsr';
import { Flashcards } from '/imports/db/Flashcards';

Meteor.methods({
  'flashcards.learn'(flashcards) {
    let { id, instance } = instanceManager.create();
    const masters = convertToMaster(flashcards);
    instance.addMasters(...masters);
    return id;
  },
  'learning.addReview'(instanceId, id, review) {
    const instance = instanceManager.get(instanceId);
    instance.addReviews(review);
    Flashcards.update({_id: id}, {$push: {
      reviews: review
    }});
  },
  'learning.nextCard'(instanceId) {
    const instance = instanceManager.get(instanceId);
    return instance.nextCard();
  }
});