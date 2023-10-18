<template>
  <v-container>
    <h1>Roll for XYZ</h1><br>
    <div v-for="creature in initRolls" :key="creature.roll">
      <CreatureCard
        :name="creature.name" :roll="creature.roll" :id="creature.id"
        :activeID="activeCreatureID" @remove-creature="removeCreature"
        />
    </div>
    <v-btn color="primary" v-on:click="nextActive">Next!</v-btn>
    <CreateCreature @new-creature="newCreature"/>
  </v-container>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import CreatureCard from './CreatureCard.vue';
  import CreateCreature from './CreateCreature.vue';

  let roll = 20 // Debug: Counts down from 20 to provide fake initiative rolls
  let activeCreatureID = ref(0) // Holds the id of which creature is active
  let activeCreatureIndex = 0 // Holds the position of the initiative of the active creature
  let id = 0 // Increments to provide a unique id for all creatures

  // Debug: Pregenerated values for initRolls. Normally will be initialized empty.
  const initRolls = ref([
    {roll: roll--, id: id++, name: "Bullywug 1"},
    {roll: 25, id: id++, name: "Bullywug 2"},
    {roll: roll--, id: id++, name: "Bullywug 3"},
    {roll: roll--, id: id++, name: "Bullywug 4"},
    {roll: roll--, id: id++, name: "Bullywug 5"},
    {roll: roll--, id: id++, name: "Bullywug 6"},
    {roll: roll--, id: id++, name: "Bullywug 7"},
  ]);
  // Get everything in the correct order on initial setup
  updateInitiativeOrder();
  activeCreatureIndex = 0;
  activeCreatureID.value = initRolls.value[activeCreatureIndex].id;

  // Maintains the sorted order of initRolls at all times (I don't think this works though!)
  watch(initRolls, () => {
    initRolls.value.sort((a, b) => b.roll - a.roll) // Sorts by initiative on init
  })

  // This might be necessary to update on an insertion into the list, but idk
  function updateInitiativeOrder() {
    initRolls.value.sort((a, b) => b.roll - a.roll);
  }
  
  // Increments the active ID through the list
  function nextActive() {
    activeCreatureIndex++;
    if (activeCreatureIndex >= initRolls.value.length) {
      activeCreatureIndex = 0;
    }
    activeCreatureID.value = initRolls.value[activeCreatureIndex].id;
    console.log("ID: " + activeCreatureID.value + "    Idx: " + activeCreatureIndex);
  }

  // Insert a new creature. Triggered by an event from the CreateCreature component
  function newCreature(c) {
    c.id = id++;

    // If the new creature displaces the current active, update the active index to keep it correct
    if (initRolls.value[activeCreatureIndex].roll < c.roll) {
      activeCreatureIndex++;
    }

    initRolls.value.push(c);
    updateInitiativeOrder();
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
      activeCreatureIndex %= initRolls.value.length; // Protect list order when the greatest index is removed
      activeCreatureID.value = initRolls.value[activeCreatureIndex].id;
    } else {
      activeCreatureID.value = null;
    }
  }
</script>

<style scoped>

</style>