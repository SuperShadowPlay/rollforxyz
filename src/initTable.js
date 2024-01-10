import { nanoid } from 'nanoid';
import { ref } from 'vue';

export default class initTable {
  constructor() {
    this.list          = ref([]);
    this.activeIndex   = -1;
    this.activeID      = ref("nothingYet");
    this.tableModified = false;
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
    this.updateLocalStorage();
  }


  add(newName, newRoll, newHealth, newAC, newDesc) {
    // Add a creature to the initiative and returns its new ID
    this.tableModified = true; // Tells localstorage updater to push a new table

    let newCreature = {
      name:   newName,
      roll:   newRoll,
      health: newHealth,
      AC:     newAC,
      desc:   newDesc,
      id:     nanoid()
    };

    this.list.value.push(newCreature);
    this.sort();
    return newCreature.id;
  }


  remove(id) {
    // Remove a creature from the list by its ID (or index) and return the index of the creature.
    // This method cannot tell if it actually removed an element, it just silently
    // keeps going if it didn't exist.
    this.tableModified = true; // Tells localstorage updater to push a new table

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


  clear() {
    // Clears the entire table at once using remove()
    const IDs = this.list.value.map((creature) => creature.id);
    IDs.forEach((id) => this.remove(id));

    // Resetting variables
    this.activeIndex = -1;
    this.activeID.value = "nothingYet";
    this.tableModified = true;
  }


  updateInfo(c) {
    // Update properties of creature

    let editedCreatureIndex = this.getIndexByID(c.id);

    this.list.value[editedCreatureIndex] = {
      name: c.name,
      desc: c.desc,
      id: c.id,
      roll: c.roll,
    };

    // If roll is changed, is re-orders the cards.
    // Right now if the active card is changed, active status moves with it down the list.
    // This seems fine but maybe it would be worth changing in the future.
    this.sort();
    this.changeActive(this.activeID.value);

    this.updateLocalStorage(); // Update localstorage with new data
  }


  serialize() {
    // Serialize the object into one stringified JSON that can be deserialized with deserialize()
    return JSON.stringify(this.list.value);
  }


  deserialize(serializedObjStr) {
    // Take a string from the serialize() function and replace the current initTable with the serialized one.

    this.clear(); // Remove current table

    // Insert new creatures from serialized data.
    let newInitTable = JSON.parse(serializedObjStr);
    newInitTable.forEach((element) => {
      this.add(
        element.name,
        element.roll,
        element.health,
        element.AC,
        element.desc,
        )
    });

    this.tableModified = true;
    this.updateLocalStorage();
  }


  updateLocalStorage() {
    // Update the local storage to enable persistence between sessions

    // Only update the whole table if it was actually changed to be less wasteful of compute power
    if (this.tableModified) {
      localStorage.setItem('initTable', this.serialize());
      this.tableModified = false;
    }

    localStorage.setItem('activeIndex', this.activeIndex);
  }


  loadFromLocalStorage() {
    // Load data from local storage
    let newInitTable = localStorage.getItem('initTable');
    if (newInitTable !== null) {
      // Save variables between loading a new init table
      let tempIndex = Number(localStorage.getItem('activeIndex'));

      this.deserialize(localStorage.getItem('initTable')); // Load init table creatures

      // Restore active index
      this.activeIndex = tempIndex

      // Update highlight effect
      if (this.activeIndex !== -1 && this.list.value.length !== 0) {
        this.changeActive(this.getIDByIndex(this.activeIndex));
      }

      this.updateLocalStorage();
    }
  }


  getIndexByID(id) {
    // Finds the index of a certain creature in the list by ID
    return this.list.value.map((c) => c.id).indexOf(id);
  }


  getIDByIndex(index) {
    // Finds the ID of a certain creature in the list by the index
    return this.list.value[index].id;
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