import { nanoid } from 'nanoid';
import { ref } from 'vue';

export default class initTable {
  constructor() {
    this.list = ref([]);
    this.activeIndex = -1;
    this.activeID = ref("nothingYet");
  }
  
  sort() {
  // Sorts the initRolls list in descending order by roll
    this.list.value.sort((a, b) => {
      if (b.roll == a.roll) {
        return a.name - b.name; // Just here to provide consistent ordering if rolls are the same
      } else {
        return b.roll - a.roll;
      } 
    })
  }  

  changeActive(newActiveID) {
    this.activeID.value = newActiveID;
    this.activeIndex = this.getIndexByID(newActiveID);
  }

  add(newName, newRoll, newHealth, newAC, newDesc) {
    // Add a creature to the initiative and returns its new ID
    let newCreature = {
      name: newName,
      roll: newRoll,
      health: newHealth,
      AC: newAC,
      desc: newDesc,
      id: nanoid()
    };
    this.list.value.push(newCreature);
    this.sort();
    return newCreature.id;
  }

  remove(id) {
    // Remove a creature from the list by its ID (or index) and return the index of the creature.
    // This method cannot tell if it actually removed an element, it just silently
    // keeps going if it didn't exist.

    let removedIndex = id;

    // Get index of the ID passed. If it's not an ID, it is likely an index instead
    if (typeof id === 'string') {
      removedIndex = this.getIndexByID(id);
    }
    else if (typeof id === 'number') {
      id = this.list[removedIndex].id;
    }
    
    // Filter out removed card
    this.list.value = this.list.value.filter((c) => c.id != id);

    return removedIndex;
  }

  getIndexByID(id) {
    // Finds the index of a certain creature in the list by ID
    return this.list.value.map((c) => c.id).indexOf(id);
  }

  // These getters only to expose reactive variables to template.
  // They are otherwise public variables in the rest of the code.
  getList() {
    return this.list;
  }
  
  getActiveID() {
    return this.activeID;
  }
}