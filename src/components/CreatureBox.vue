<template>
  <v-container>
    <br>
    <div class="nextButton">
      <v-btn color="primary" size="x-large" v-on:click="nextButtonClick">Next!</v-btn>
    </div>
    
    <div class="content">
      <transition-group name="card" tag="div" class="cards">
          <CreatureCard
            v-for="creature in initRolls" :key="creature.id"
            :name="creature.name" :roll="creature.roll" :id="creature.id"
            :activeID="activeCreatureID" @remove-creature="removeCreature"
            class="individualCard"
          />
      </transition-group>
      <br>
      <CreateCreature @new-creature="newCreature"/>
    </div>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue'
  import CreatureCard from './CreatureCard.vue';
  import CreateCreature from './CreateCreature.vue';

  //
  let activeCreatureID = ref(-1) // Holds the id of which creature is active
  let activeCreatureIndex = -1 // Holds the position of the initiative of the active creature
  let encounterActive = false // If the user has begun scrolling initiative for the encounter
  let id = 0 // Increments to provide a unique id for all creatures

  // Debug: Pregenerated values for initRolls. Normally will be initialized empty.
  /*
  let roll = 20 // Debug: Counts down from 20 to provide fake initiative rolls
  const initRolls = ref([
    {roll: roll--, id: id++, name: "Bullywug 1"},
    {roll: 25, id: id++, name: "Bullywug 2"},
    {roll: roll--, id: id++, name: "Bullywug 3"},
    {roll: roll--, id: id++, name: "Bullywug 4"},
    {roll: roll--, id: id++, name: "Bullywug 5"},
    {roll: roll--, id: id++, name: "Bullywug 6"},
    {roll: roll--, id: id++, name: "Bullywug 7"},
  ]);
  updateInitiativeOrder();
  */

  // Get everything in the correct order on initial setup
  const initRolls = ref([]);
  resetEncounter()

  // Sorts the initRolls list in descending order by roll
  function updateInitiativeOrder() {
    initRolls.value.sort((a, b) => {
      if (b.roll == a.roll) {
        return a.id - b.id;
      } else {
        return b.roll - a.roll;
      } 
    });
  }
  
  // Initializes variables to a default, non-active state
  function resetEncounter() {
    encounterActive = false;
    activeCreatureID.value = -1;
    activeCreatureIndex = -1;
  }

  // Increments the active ID through the list
  function nextActive() {
    if (encounterActive){      
      // Move index
      console.log("ID: " + activeCreatureID.value + "    Idx: " + activeCreatureIndex);
      activeCreatureIndex++;
      activeCreatureIndex %= initRolls.value.length;

      // Update active card
      activeCreatureID.value = initRolls.value[activeCreatureIndex].id;
      console.log("ID: " + activeCreatureID.value + "    Idx: " + activeCreatureIndex);
    }
  }

  // Run when the next button is clicked
  function nextButtonClick() {
    encounterActive = true;
    nextActive();
  }

  // Insert a new creature. Triggered by an event from the CreateCreature component
  function newCreature(c) {
    c.id = id++;

    initRolls.value.push(c);
    let previousActiveRoll;
    if (encounterActive) { previousActiveRoll = initRolls.value[activeCreatureIndex].roll; }
    updateInitiativeOrder();

    // If the new creature displaces the current active, preserve the correct order and active card.
    if (encounterActive) {
      if (initRolls.value.length > 1) {
        console.log(previousActiveRoll < c.roll) // This makes the branch work correctly for some reason???? javascript why
        if (previousActiveRoll < c.roll) {
          nextActive();
        }
      } else {
        activeCreatureIndex--;
        nextActive();
      }
    }
    
  }

  // Triggered by removeCreature event from CreatureCard. Removes the creature that caused the event.
  function removeCreature(id) {
    // Reset tracking variables
    let removedCreatureIndex = initRolls.value.map((c) => c.id).indexOf(id);
    // Filter out removed card
    initRolls.value = initRolls.value.filter((c) => c.id != id);

    if (encounterActive) {
      if (activeCreatureIndex > removedCreatureIndex) { // Only decrement when necessary to protect list order
        activeCreatureIndex--;
      }
      
      if (initRolls.value.length != 0) {
        activeCreatureIndex %= initRolls.value.length; // Protect list order when the greatest index is removed
        activeCreatureID.value = initRolls.value[activeCreatureIndex].id;
      }
    }
  }
</script>

<style scoped>
.content {
  width: 100%;
}

.card-enter-active,
.card-leave-active {
  transition: all 0.5s ease-in-out;
}

.card-move,
.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translate(30px);
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>