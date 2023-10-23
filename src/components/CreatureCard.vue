<template>
  <div class="card">
    <v-card
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
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  const props = defineProps(['name', 'roll', 'id', 'activeID'])

  /*
  This card is used to display each creature in the initative roll.
  The activeID prop is sent to all cards to communicate who should be active (ie: it's your turn, so change color)
  Each card waits until its their turn to be active, and then runs a transition and changes color to reflect when it is time.
  */

  // The pre-defined translations for an active or inactive card
  const cardTrans = {
    inactive: 'translate(0px)',
    active:   'translate(15px)'
  }

  let previouslyActive = false; // If on the last activeID change, this card was active
  let activeTrans = ref(cardTrans.inactive); // Which cardTrans is currently in use

  // Changes card to be "active" if the current creature in the initiative order is the current prop
  // Reactive based on activeID
  let activeVals = computed(() => {
    if (props.activeID === props.id) {
      // Is active
      return {isActive: true, color: 'accent', elevation: 20}
    } else {
      // Is not active
      return {isActive: false, color: 'secondary', elevation: 1}
    }

    
  })

  watch(activeVals, (activeVals) => {
    // If current card was just made active, then run the activate animation
    if (!previouslyActive && activeVals.isActive) {
      previouslyActive = true;
      activeTrans.value = cardTrans.active;

    }
    // If current card was just deactivated, then run the deactivate animation
    else if (previouslyActive && !activeVals.isActive) {
      previouslyActive = false;
      activeTrans.value = cardTrans.inactive;
    }
  })

  const cardText = ref("Init roll: " + props.roll)
</script>

<style scoped>
.card {
  margin: 10px;
  transform: v-bind(activeTrans);
  transition: all 0.3s linear;
}
</style>