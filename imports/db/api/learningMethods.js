import { instanceManager, convertToMaster } from '/server/dolphinsr';
import { Collections } from '/imports/db/Collections';

Meteor.methods({
  'learn.start'(flashcards) {
    let { id, instance } = instanceManager.create();
    const masters = convertToMaster(flashcards);
    instance.addMasters(...masters);
    return id;
  },
  'learn.addReview'(instanceId, id, review) {
    const instance = instanceManager.get(instanceId);
    instance.addReviews(review);
    Collections.rawCollection().updateMany({}, {
      $push: {
        'flashcards.$[element].reviews': review
      }
    }, {
      arrayFilters: [
        {
          'element._id': id
        }
      ]
    })
  },
  'learn.nextCard'(instanceId) {
    const instance = instanceManager.get(instanceId);
    return instance.nextCard();
  }
});