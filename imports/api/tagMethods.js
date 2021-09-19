import Collections from '/imports/db/Collections';

Meteor.methods({
  async 'tag.rename'(oldName, newName) {
    await Collections.rawCollection().updateMany({}, {
      $set: {
        'flashcards.$[].tags.$[tag]': newName
      }
    }, {
      arrayFilters: [
        {
          'tag': oldName
        }
      ]
    })
  }
});