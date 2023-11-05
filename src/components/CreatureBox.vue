<template>
  <v-container>

    <transition name="fade">
      <div v-if="initTable.list.value.length == 0" class="emptyText">
        <h1>Nothing is here yet!</h1>
        <h2>Press the <v-icon icon="mdi-plus-circle-outline"/> below to begin.</h2>
      </div>
    </transition>

    <div class="content">
      <transition-group name="card" tag="div" class="cards">
        <CreatureCard
          v-for="creature in creatureListRef" :key="creature.id"
          :name="creature.name" :desc="creature.desc"
          :roll="creature.roll" :health="creature.health"
          :id="creature.id" :activeID="activeIDRef"
          @remove-creature="removeCreature" @update-info="updateInfo" @change-active="changeActive"
          class="individualCard"
        />
      </transition-group>      
    </div>

  </v-container>
</template>

<script setup>
  import { computed, watch } from 'vue';
  import { useStore } from 'vuex';

  import CreatureCard from './CreatureCard.vue';
  import initTableClass from '@/initTable';

  const store = useStore(); // Vuex store
  const initTable = new initTableClass(); // Holds the creatures in the initiative
  const creatureListRef = initTable.getList(); // Expose the list to the template (for some reason?)
  const activeIDRef = initTable.getActiveID(); // Same as above

  let encounterActive = false // If the user has begun scrolling initiative for the encounter

  // Get everything in the correct order on initial setup
  resetEncounter()

  /*// Debug: Pregenerated values for initTable.list. Normally will be initialized empty.
  initTable.add('Reya', 5, 'boring lawful good');
  //initTable.add('Kimya', 16, 'crown wearer');
  initTable.add('Josiah', 11, 'government agent');
  //initTable.add('Sentry', 6, 'eats eyeballs');
  initTable.add('Kurek', 18, 'puts up with them');*/
  
  // Initializes variables to a default, non-active state
  function resetEncounter() {
    encounterActive = false;
    initTable.activeID.value = -1;
    initTable.activeIndex = -1;
  }

  // Increments the active ID through the list
  function nextActive() {
    if (encounterActive){      
      // Move index
      console.log("ID: " + initTable.activeID.value + "    Idx: " + initTable.activeIndex);
      initTable.activeIndex++;
      initTable.activeIndex %= initTable.list.value.length;

      // Update active card
      initTable.activeID.value = initTable.list.value[initTable.activeIndex].id;
      console.log("ID: " + initTable.activeID.value + "    Idx: " + initTable.activeIndex);
    }
  }

  // Run when the next button is clicked
  let newNextButtonClick = computed(() => {
    return store.state.nextButtonClick;
  });
  watch (newNextButtonClick, () => {
    if (initTable.list.value.length != 0) { encounterActive = true; }
    nextActive();
  });

  // Watch for a new creature being added via the store
  let newCreatureRequest = computed(() => {
    return store.state.nextCreature;
  });
  watch(newCreatureRequest, (newCreatureProp) => insertNewCreature(newCreatureProp)); // DONT KNOW IF THIS WORKS, BUT IT SHOULD IF YOU MODIFY CREATECREATURE.VUE TO USE THE STORE INSTEAD OF EVENTS

  // Insert a new creature. Triggered by a change to the store's nextCreature object.
  function insertNewCreature(c) {
    let previousActiveRoll;
    if (encounterActive) { previousActiveRoll = initTable.list.value[initTable.activeIndex].roll; }

    initTable.add(c.name, c.roll, c.desc);

    // If the new creature displaces the current active, preserve the correct order and active card.
    if (encounterActive) {
      if (initTable.list.value.length > 1) {
        if (previousActiveRoll < c.roll) {
          nextActive();
        }
      } else {
        initTable.activeIndex--;
        nextActive();
      }
    }
  }

  // Triggered by removeCreature event from CreatureCard. Removes the creature that caused the event.
  function removeCreature(id) {
    let removedCreatureIndex = initTable.remove(id);

    if (encounterActive) {
      if (initTable.activeIndex > removedCreatureIndex) { // Only decrement when necessary to protect list order
        initTable.activeIndex--;
      }
      
      if (initTable.list.value.length != 0) {
        initTable.activeIndex %= initTable.list.value.length; // Protect list order when the greatest index is removed
        initTable.activeID.value = initTable.list.value[initTable.activeIndex].id;
      }
      else { // List is empty, so encounter is inactive
        resetEncounter();
      }
    }
  }

  // Runs when a creature card is updated
  function updateInfo(c) {
    // When edit mode is exited on a card, this is called to make the changes.
    let editedCreatureIndex = initTable.getIndexByID(c.id);

    // Update properties of creature
    initTable.list.value[editedCreatureIndex] = {
      name: c.name,
      desc: c.desc,
      id: c.id,
      roll: c.roll,
    };

    // If roll is changed, is re-orders the cards.
    // Right now if the active card is changed, active status moves with it down the list.
    // This seems fine but maybe it would be worth changing in the future.
    initTable.sort();
    initTable.changeActive(initTable.activeID.value);
  }

  function changeActive(newActiveID) {
    // Check if this creature became active
    encounterActive = true;
    initTable.changeActive(newActiveID)
  }
</script>

<style scoped>
.emptyText {
  position: fixed;
  top: 30%;
  left: 50%;
  width: 80%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #8e8e8e;
}

.content {
  width: 100%;
}

.newCreatureBox {
  float: center;
}

.card-enter-active,
.card-leave-active {
  transition: all 0.5s ease-in-out;
}

.card-move {
  transform: translate(0px);
}
.card-enter-from {
  opacity: 0;
  transform: translate(30px);
}
.card-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>