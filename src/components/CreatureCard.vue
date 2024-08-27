<template>
  <div class="card" ref="cardContainer">
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
          prepend-inner-icon="mdi-dice-d20"
          type="text"
          :variant="editMode ? 'underlined' : 'plain'"
          v-model="properties.roll"
          :readonly="!editMode"
          :label="editMode ? 'Roll' : ''"/>
        </v-card-subtitle>
      </v-card-item>

      <v-row justify="center">
        <v-col cols="11">
          <v-card-text v-if="!editMode"
          :label="editMode ? 'Description' : ''">
          {{ properties.desc }}
          </v-card-text>
          <v-textarea v-else
          v-model="properties.desc"/>
        </v-col>
      </v-row>
      
      <v-card-item>
        <div class="health">
          <v-row>
            <v-col cols="2">
              <v-card-actions class="healthButtonContainer">
                <v-menu location="top center" origin="auto" transition="slide-x-transition">
                  <template v-slot:activator="{ props: menu }">

                    <v-tooltip text="Add Health" location="bottom center">
                      <template v-slot:activator="{ props: tooltip }">
                        <v-btn icon="mdi-plus-box" v-bind="mergeProps(menu, tooltip)"/>
                      </template>
                    </v-tooltip>
                    
                  </template>
                  <HealthMenu @healthChange="healthButtonClick"/>
                </v-menu>

                <v-tooltip text="Subtract Health" location="bottom center">
                  <template v-slot:activator="{ props }">
                    <v-btn v-on:click="properties.health--" icon="mdi-minus-box" v-bind="props"/>
                  </template>
                </v-tooltip>
              </v-card-actions>
            </v-col>

            <v-col>
              <v-text-field
              class="healthCount"
              prepend-inner-icon="mdi-heart"
              :variant="editMode ? 'underlined' : 'plain'"
              :type="editMode ? 'number': 'text'"
              :label="editMode ? 'Health' : ''"
              :readonly="!editMode"
              v-model="properties.health">
              </v-text-field>
            </v-col>

            <v-col>
              <v-text-field
              class="ACCount"
              prepend-inner-icon="mdi-shield"
              :variant="editMode ? 'underlined' : 'plain'"
              :type="editMode ? 'number': 'text'"
              :label="editMode ? 'AC' : ''"
              :readonly="!editMode"
              v-model="properties.AC">
              </v-text-field>
            </v-col>
          </v-row>
        </div>
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
  import { ref, computed, watch, mergeProps } from 'vue'
  const props = defineProps(['name', 'roll', 'desc', 'health', 'AC', 'id', 'activeID', 'autoScroll'])
  const emit = defineEmits(['removeCreature', 'updateInfo', 'changeActive'])

  import HealthMenu from './HealthMenu.vue';

  let properties = ref({ // Contains props in an editable fashion
    name: props.name,
    roll: props.roll,
    desc: props.desc,
    health: props.health,
    AC: props.AC,
    id: props.id,
    activeID: props.activeID,
    autoScroll: props.autoScroll,
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
  const cardContainer = ref(null); // ref for scrolling to active card

  // Reactive based on activeID
  // This handles the "functional" attributes of the card while `properties` holds all the actual data
  let cardConfig = computed(() => {
    // Defualt (non-active) values
    let vals = {
      isActive: false,
      color: 'secondary',
      elevation: 1,
    }

    // If active
    if (props.activeID === props.id) {
      vals.isActive = true;
      vals.color = 'accent';
      vals.elevation = 20;
      
      if (props.autoScroll === true) {
        cardContainer.value?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }

    // Set to grey if card is at 0 health at creation
    if (Number(properties.value.health) <= 0) {
      vals.color = 'info';
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

  function healthButtonClick(healthAdjust) {
    // Updates health based on user input in the health menu
    properties.value.health = Number(properties.value.health) + healthAdjust;
    emit('updateInfo', properties.value)
  }
</script>

<style scoped>
.card {
  margin: 10px;

  transform: v-bind(activeTrans);
  transition: all 0.3s linear;

  scroll-margin: 15vh;
}

.health {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.healthCount {
  order: 1;
  flex-basis: 20%;
  flex-shrink: 1;
  flex-grow: 1;
}

.healthButtonContainer {
  order: 2;
  flex-basis: 80%;
  flex-shrink: 2;
  flex-grow: 2;
}

</style>