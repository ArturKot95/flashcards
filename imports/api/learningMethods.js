import { DolphinSR } from 'dolphinsr';
import { instanceManager, convertToMaster } from '/server/dolphinsr';
import Collections from '/imports/db/Collections';

Meteor.methods({
  'learn.start'(flashcards) {
    let { id, instance } = instanceManager.create();
    instance.addMasters(...convertToMaster(flashcards));

    let reviews = [];
    flashcards.forEach(f => reviews.push(...f.reviews));
    instance.addReviews(...reviews);

    return { id, summary: instance.summary() };
  },

  'learn.getSummary'(flashcards) {
    let instance = new DolphinSR();
    instance.addMasters(...convertToMaster(flashcards));
    let reviews = [];
    flashcards.forEach(f => reviews.push(...f.reviews));
    instance.addReviews(...reviews);

    return instance.summary();
  },

  async 'learn.addReview'(instanceId, id, review) {
    const instance = instanceManager.get(instanceId);
    instance.addReviews(review);
    await Collections.rawCollection().updateMany({}, {
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

    return instance.summary();
  },
  'learn.nextCard'(instanceId) {
    const instance = instanceManager.get(instanceId);
    return instance.nextCard();
  }
});