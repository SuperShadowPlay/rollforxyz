<template>
  <v-container>
    <h1>Roll for
      <img class="logo" :src="logoImage"/>
    </h1>
    <br>
    <v-btn color="primary" size="x-large" v-on:click="nextActive">Next!</v-btn>
    <div v-for="creature in initRolls" :key="creature.roll">
      <CreatureCard
        :name="creature.name" :roll="creature.roll" :id="creature.id"
        :activeID="activeCreatureID" @remove-creature="removeCreature"
        />
    </div>
    <br>
    <CreateCreature @new-creature="newCreature"/>
  </v-container>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import CreatureCard from './CreatureCard.vue';
  import CreateCreature from './CreateCreature.vue';

  import logoImage from "../assets/xyz_small.png";

  //let roll = 20 // Debug: Counts down from 20 to provide fake initiative rolls
  let activeCreatureID = ref(0) // Holds the id of which creature is active
  let activeCreatureIndex = 0 // Holds the position of the initiative of the active creature
  let id = 0 // Increments to provide a unique id for all creatures

  // Debug: Pregenerated values for initRolls. Normally will be initialized empty.
  /*const initRolls = ref([
    {roll: roll--, id: id++, name: "Bullywug 1"},
    {roll: 25, id: id++, name: "Bullywug 2"},
    {roll: roll--, id: id++, name: "Bullywug 3"},
    {roll: roll--, id: id++, name: "Bullywug 4"},
    {roll: roll--, id: id++, name: "Bullywug 5"},
    {roll: roll--, id: id++, name: "Bullywug 6"},
    {roll: roll--, id: id++, name: "Bullywug 7"},
  ]);*/
  // Get everything in the correct order on initial setup
  const initRolls = ref([]);
  updateInitiativeOrder();
  activeCreatureIndex = 0;
  //activeCreatureID.value = initRolls.value[activeCreatureIndex].id;

  // Maintains the sorted order of initRolls at all times (I don't think this works though!)
  watch(initRolls, () => {
    initRolls.value.sort((a, b) => b.roll - a.roll) // Sorts by initiative on init
  })

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
  
  // Increments the active ID through the list
  function nextActive() {
    // Move index
    console.log("ID: " + activeCreatureID.value + "    Idx: " + activeCreatureIndex);
    activeCreatureIndex++;
    activeCreatureIndex %= initRolls.value.length;

    // Update active card
    activeCreatureID.value = initRolls.value[activeCreatureIndex].id;
    console.log("ID: " + activeCreatureID.value + "    Idx: " + activeCreatureIndex);
  }

  // Insert a new creature. Triggered by an event from the CreateCreature component
  function newCreature(c) {
    c.id = id++;

    initRolls.value.push(c);
    let previousActiveRoll = initRolls.value[activeCreatureIndex].roll;
    updateInitiativeOrder();

    // If the new creature displaces the current active, preserve the correct order and active card.
    if (initRolls.value.length > 1) {
      console.log("almost here " + previousActiveRoll + " new: " + c.roll + " eval: ")
      console.log(previousActiveRoll < c.roll) // This makes the branch work correctly for some reason???? javascript why
      if (previousActiveRoll < c.roll) {
        console.log("Here")
        nextActive();
      }
    } else {
      activeCreatureIndex--;
      nextActive();
      console.log("NOt here");
    }
    
  }

  // Triggered by removeCreature event from CreatureCard. Removes the creature that caused the event.
  function removeCreature(id) {
    console.log("Before removal ID: " + activeCreatureID.value + "    Idx: " + activeCreatureIndex);
    // Reset tracking variables
    let removedCreatureIndex = initRolls.value.map((c) => c.id).indexOf(id);
    // Filter out removed card
    initRolls.value = initRolls.value.filter((c) => c.id != id);
    console.log("After removal: ID: " + activeCreatureID.value + "    Idx: " + activeCreatureIndex);

    if (activeCreatureIndex >= 0) {
      if (activeCreatureIndex > removedCreatureIndex) { // Only decrement when necessary to protect list order
        activeCreatureIndex--;
      }
      
      if (initRolls.value.length != 0) {
        activeCreatureIndex %= initRolls.value.length; // Protect list order when the greatest index is removed
        activeCreatureID.value = initRolls.value[activeCreatureIndex].id;
      }
    } else {
      activeCreatureID.value = 0;
    }
  }
</script>

<style scoped>
  .img {
    max-width: auto;
    max-height: 100%;
  }

  .logo {
    height: 50px;
  }
</style>