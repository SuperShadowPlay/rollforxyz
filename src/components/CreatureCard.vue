<template>
  <v-card
  class="card"
  :color="activeVals.color"
  :title="name"
  :text="cardText"
  :elevation="activeVals.elevation">
  {{id}} ACTIVE: {{ activeID }}
  </v-card>
</template>

<script setup>
  import { ref, computed } from 'vue'
  const props = defineProps(['name', 'roll', 'id', 'activeID'])

  let activeVals = computed(() => {
    console.log("Changed!")
    console.log(props.activeID)
    if (props.activeID === props.id) { // Is active
      return {color: "error", elevation: 20}
    } else { // Is not active
      return {color: "secondary", elevation: 1}
    }
  })

  const cardText = ref("Init roll: " + props.roll)
</script>

<style scoped>
  .card {
    margin: 10px;
  }
</style>