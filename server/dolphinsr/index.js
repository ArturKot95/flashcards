import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { DolphinSR } from 'dolphinsr';

const instanceManager = {
  instances: [],
  create() {
    let instance = {
      id: Random.id(),
      instance: new DolphinSR()
    };
    this.instances.push(instance);
    return instance;
  },
  get(id) {
    for (let instance of this.instances) {
      if (instance.id === id) return instance.instance;
    }
  },
  remove(id) {
    for (let i in this.instances) {
      if (this.instances[i].id === id) {
        delete this.instances[i];
        return;
      }
    }
  }
};

function convertToMaster(flashcards) {
  let masters = [];
  flashcards.forEach(flashcard => {
    let master = {};
    master.id = flashcard._id;
    master.combinations = [
      {front: [0], back: [1]}, 
      {front: [1], back: [0]}
    ];
    master.fields = [flashcard.front, flashcard.back];
    masters.push(master);
  });

  return masters;
}

export {
  instanceManager,
  convertToMaster
}