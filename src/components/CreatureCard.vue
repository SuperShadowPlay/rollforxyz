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
          <v-text-field
          style="width: 80px"
          prepend-inner-icon="mdi-dice-d20"
          :type="editMode ? 'number' : 'text'"
          :variant="editMode ? 'underlined' : 'plain'"
          v-model="properties.roll"
          :label="editMode ? 'Roll' : ''"/>
          <p>ID: {{ properties.id }}</p>
        </v-card-subtitle>
      </v-card-item>

      <v-card-item>
        <v-card-text v-if="!editMode"
        :label="editMode ? 'Description' : ''">
          {{ properties.desc }}
        </v-card-text>
        <v-textarea v-else v-model="properties.desc"></v-textarea>
      </v-card-item>
      
      <v-card-item>
        <v-text-field
        prepend-inner-icon="mdi-heart"
        style="width: 100px"
        :variant="editMode ? 'underlined' : 'plain'"
        :type="editMode ? 'number': 'text'"
        :label="editMode ? 'Health' : ''"
        :readonly="!editMode"
        v-model="properties.health">
        </v-text-field>

        <v-card-actions>
          <v-tooltip text="Add Health" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-on:click="console.log('ADD BUTTON NOT IMPLEMENTED')" icon="mdi-plus-box" v-bind="props"/>
            </template>
          </v-tooltip>

          <v-tooltip text="Subtract Health" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-on:click="console.log('SUBTRACT BUTTON NOT IMPLEMENTED')" icon="mdi-minus-box" v-bind="props"/>
            </template>
          </v-tooltip>
        </v-card-actions>
      </v-card-item>
    
      <v-card-actions class="right">
        <v-tooltip text="Remove" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn v-on:click="removeButtonClick" icon="mdi-close-circle" v-bind="props"/>
          </template>
        </v-tooltip>
        
        <v-tooltip v-if="!editMode" text="Edit" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn v-on:click="editButtonClick" icon="mdi-pencil-outline" v-bind="props"/>
          </template>
        </v-tooltip>

        <v-tooltip v-else text="Save" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn v-on:click="editButtonClick" icon="mdi-content-save-edit-outline" v-bind="props"/>
          </template>
        </v-tooltip>

        <v-tooltip text="Select" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn v-on:click="selectButtonClick" icon="mdi-arrow-right-drop-circle" v-bind="props"/>
          </template>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  const props = defineProps(['name', 'roll', 'desc', 'health', 'id', 'activeID'])
  const emit = defineEmits(['removeCreature', 'updateInfo', 'changeActive'])

  let properties = ref({ // Contains props in an editable fashion
    name: props.name,
    roll: props.roll,
    desc: props.desc,
    health: props.health,
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

      emit('updateInfo', properties.value)
    }
    else { // Turn on edit mode
      editMode.value = true;
    }
  }

  function selectButtonClick() {
    // When this current card is forcibly made the active card
    emit('changeActive', properties.value.id)
  }

  function removeButtonClick() {
    emit('removeCreature', props.id)
  }
</script>

<style scoped>
.card {
  margin: 10px;
  transform: v-bind(activeTrans);
  transition: all 0.3s linear;
}
</style>