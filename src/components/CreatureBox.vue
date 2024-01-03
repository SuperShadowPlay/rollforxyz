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
          :roll="creature.roll" :health="creature.health" :AC="creature.AC"
          :id="creature.id" :activeID="activeIDRef" :autoScroll="autoScroll"
          @remove-creature="removeCreature" @update-info="updateInfo" @change-active="changeActive"
          class="individualCard"
        />
      </transition-group>      
    </div>

  </v-container>
</template>

<script setup>
  import { computed, watch, ref } from 'vue';
  import { useStore } from 'vuex';

  import CreatureCard from './CreatureCard.vue';
  import initTableClass from '@/initTable';

  const store = useStore(); // Vuex store
  const initTable = new initTableClass(); // Holds the creatures in the initiative
  const creatureListRef = initTable.getList(); // Expose the list to the template (for some reason?)
  const activeIDRef = initTable.getActiveID(); // Same as above
  const autoScroll = ref(false);

  let encounterActive = false // If the user has begun tracking initiative for the encounter

  // Get everything in the correct order on initial setup
  encounterActive = false;
  initTable.activeID.value = -1;
  initTable.activeIndex = -1;

  // If a previous session exists in localStorage, load it
  initTable.loadFromLocalStorage();

  // Debug: Pregenerated values for initTable.list. Normally will be initialized empty.
  /*initTable.add('Reya', 5, 44, 18, 'boring lawful good');
  initTable.add('Josiah', 11, 35, 16, 'government agent');
  initTable.add('Kurek', 18, 37, 14, 'puts up with them');
  */
  
  // Initializes variables to a default, non-active state
  function resetEncounter() {
    encounterActive = false;
    initTable.activeID.value = -1;
    initTable.activeIndex = -1;
    initTable.clear();
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

    initTable.updateLocalStorage();
  }


  // Run when the next button is clicked
  let newNextButtonClick = computed(() => {
    return store.state.nextButtonClick;
  });
  watch (newNextButtonClick, () => {
    if (initTable.list.value.length != 0) { encounterActive = true; }
    autoScroll.value = true; // Allow auto scrolling to next card
    nextActive();
  });


  // Watch for a new creature being added via the store
  let newCreatureRequest = computed(() => {
    return store.state.nextCreature;
  });
  watch(newCreatureRequest, (newCreatureProp) => insertNewCreature(newCreatureProp));


  // Insert a new creature. Triggered by a change to the store's nextCreature object.
  function insertNewCreature(c) {
    autoScroll.value = false; // Disable auto scrolling to next card
    let previousActiveRoll;
    if (encounterActive) { previousActiveRoll = initTable.list.value[initTable.activeIndex].roll; }

    console.log(c)
    initTable.add(c.name, c.roll, c.health, c.AC, c.desc);

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

    // Preserve changes in localStorage
    //initTable.changeActive(initTable.getIDByIndex(initTable.activeIndex));
    initTable.updateLocalStorage();
  }


  // Triggered by removeCreature event from CreatureCard. Removes the creature that caused the event.
  function removeCreature(id) {
    autoScroll.value = false; // Disable auto scrolling to next card
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

    // Preserve changes in localStorage
    initTable.changeActive(initTable.getIDByIndex(initTable.activeIndex));
    initTable.updateLocalStorage();
  }


  // Runs when a creature card is updated
  function updateInfo(c) {
    // When edit mode is exited on a card, this is called to make the changes.
    initTable.updateInfo(c);
  }


  function changeActive(newActiveID) {
    // Check if this creature became active
    encounterActive = true;
    initTable.changeActive(newActiveID)
  }


  // Watch for download button click. When it happens, upload the initTable to store
  let downloadEncounterRequest = computed(() => {
    return store.state.downloadButtonClick;
  });
  watch(downloadEncounterRequest, () => saveEncounter());


  // Watch for upload button click. When it happens, grab the new initTable from the store and load it
  let uploadEncounterRequest = computed(() => {
    return store.state.newInitTableLoaded;
  });
  watch(uploadEncounterRequest, () => loadEncounter());


  function saveEncounter() {
    // Send initTable to the store to be saved externally by the user.
    store.commit('uploadInitTableToStore', initTable);
  }


  function loadEncounter() {
    // Loads a whole user-uploaded encounter from the upload button.
    // This function is not used when starting from scratch with a blank page, only for the aforementioned purpose above.
    initTable.deserialize(store.state.serializedInitTable);
  }


  // Watch for clear button click. When it happens, clear the whole initTable
  let clearEncounterRequest = computed(() => {
    return store.state.clearButtonClick;
  });
  watch(clearEncounterRequest, () => {
    resetEncounter();
    initTable.updateLocalStorage();
  });
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
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>