<template>
  <div class="card">
    <v-card
    :color="cardConfig.color"
    :elevation="cardConfig.elevation">

      <v-card-item>
        <v-card-title>
          <p v-if="!editMode">{{ properties.name }}</p>
          <v-text-field v-else variant="underlined" v-model="properties.name" label="Name"/>
        </v-card-title>
        <v-card-subtitle>
          <p v-if="!editMode">Roll: {{ properties.roll }}</p>
          <v-text-field v-else type="number" style="width: 80px"
          v-model="properties.roll" label="Roll"/>
          <p>ID: {{ properties.id }}</p>
        </v-card-subtitle>
      </v-card-item>

      <v-card-text v-if="!editMode">{{ properties.desc }}</v-card-text>
      <v-textarea v-else v-model="properties.desc"></v-textarea>
    
      <v-card-actions class="right">
        <v-btn v-on:click="$emit('removeCreature', props.id)" icon="mdi-close-circle"/>
        <v-btn v-on:click="editButtonClick" :icon="editButtonIcon"/>
        <v-btn v-on:click="selectButtonClick" icon="mdi-arrow-right-drop-circle"/>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  const props = defineProps(['name', 'roll', 'desc', 'id', 'activeID'])
  const emit = defineEmits(['updateInfo', 'changeActive'])

  let properties = ref({ // Contains props in an editable fashion
    name: props.name,
    roll: props.roll,
    desc: props.desc,
    id: props.id,
    activeID: props.activeID,
  });

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
  let editButtonIcon = ref('mdi-pencil-outline'); // Icon of the edit button (it changes)

  let editMode = ref(false); // Specifies if card information is editable

  // Changes card to be "active" if the current creature in the initiative order is the current prop
  // Reactive based on activeID
  let cardConfig = computed(() => {
    // Defualt (non-active) values
    let vals = {
      isActive: false,
      color: 'secondary',
      elevation: 1,
    }

    // If active
    if (props.activeID === props.id) {
      // Is active
      vals.isActive = true;
      vals.color = 'accent';
      vals.elevation = 20;
    }

    // Different color for edit mode
    if (editMode.value) {
      vals.color = 'warning';
    }
    // TODO: Make a nicer accent color than just warning color for editing?
    
    return vals;
  })

  watch(cardConfig, (cardConfig) => {
    // If current card was just made active, then run the activate animation
    if (!previouslyActive && cardConfig.isActive) {
      previouslyActive = true;
      activeTrans.value = cardTrans.active;

    }
    // If current card was just deactivated, then run the deactivate animation
    else if (previouslyActive && !cardConfig.isActive) {
      previouslyActive = false;
      activeTrans.value = cardTrans.inactive;
    }
  })

  function editButtonClick() {
    if (editMode.value) { // Turn off edit mode and send out update of properties
      editMode.value = false;
      editButtonIcon.value = 'mdi-pencil-outline'
      
      emit('updateInfo', properties)
    }
    else { // Turn on edit mode
      editMode.value = true;
      editButtonIcon.value = 'mdi-content-save-edit-outline'
    }
  }

  function selectButtonClick() {
    // When this current card is forcibly made the active card
    emit('changeActive', properties.value.id)
  }
</script>

<style scoped>
.card {
  margin: 10px;
  transform: v-bind(activeTrans);
  transition: all 0.3s linear;
}
</style>