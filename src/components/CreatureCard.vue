<template>
  <v-card
  class="card"
  :color="activeVals.color"
  :title="name"
  :text="cardText"
  :elevation="activeVals.elevation">

    <v-card-item>
      ID: {{id}} ACTIVE: {{ activeID }}
    </v-card-item>
  
    <v-card-actions class="right">
      <v-btn v-on:click="$emit('removeCreature', props.id)" icon="mdi-close-circle"></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  import { ref, computed } from 'vue'
  const props = defineProps(['name', 'roll', 'id', 'activeID'])

  // Changes card to be "active" if the current creature in the initiative order is the current prop
  // Reactive based on activeID
  let activeVals = computed(() => {
    if (props.activeID === props.id) {
      // Is active
      return {color: 'accent', elevation: 20}
    } else {
      // Is not active
      return {color: 'secondary', elevation: 1}
    }
  })

  const cardText = ref("Init roll: " + props.roll)
</script>

<style scoped>
  .card {
    margin: 10px;
  }
</style>