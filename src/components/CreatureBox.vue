<template>
  <v-container>
    <h1>Roll for XYZ</h1><br>
    <div v-for="creature in initRolls" :key="creature.roll">
      <CreatureCard :name="creature.name" :roll="creature.roll" :id="creature.id" :activeID="activeCreatureID"/>
    </div>
    <v-btn color="primary" v-on:click="nextActive">Next!</v-btn>
  </v-container>
</template>

<script setup>
  import { ref, watch, } from 'vue'
  import CreatureCard from './CreatureCard.vue';

  let roll = 20 // Debug: Counts down from 20 to provide fake initiative rolls
  let activeCreatureID = ref(0) // Holds the id of which creature is active
  let activeCreatureIndex = 0 // Holds the position of the initiative of the active creature
  let id = 0 // Increments to provide a unique id for all creatures

  // Debug: A table of creatures (to be replaced with a dynamic addition button/form)
  const initRolls = ref([
    {roll: roll--, id: id++, name: "Bullywug 1"},
    {roll: 25, id: id++, name: "Bullywug 2"},
    {roll: roll--, id: id++, name: "Bullywug 3"},
  ])
  initRolls.value.sort((a, b) => b.roll - a.roll) // Sorts by initiative on init
  activeCreatureID.value = initRolls.value[0].id;

  // This might be necessary to update on an insertion into the list, but idk
  watch(initRolls, () => {
    initRolls.value.sort((a, b) => b.roll - a.roll);
  })
  
  // Increments the active ID through the list
  function nextActive() {
    activeCreatureIndex++;
    if (activeCreatureIndex >= initRolls.value.length) {
      activeCreatureIndex = 0;
    }
    activeCreatureID.value = initRolls.value[activeCreatureIndex].id;
    console.log("ID: " + activeCreatureID.value + "    Idx: " + activeCreatureIndex);
  }
</script>

<style scoped>

</style>