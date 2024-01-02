<template>
  <div class="container">

    <div class="nextButton button">
      <v-btn color="primary" icon="mdi-arrow-down-thick" size="x-large" v-on:click="nextButtonClick"/>
    </div>

      <div class="optionsButton button" id="rotate">
        <v-btn color="primary" icon="mdi-cog" size="large" v-on:click="optionsButtonClick"/>
      </div>

    <transition name="openOptions">
      <div class="extraOptions container" v-if="showExtra">
        <div class="createButton button">
          <v-dialog activator="parent" width="auto">
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" icon="mdi-plus-circle-outline" v-bind="props"></v-btn>
            </template>
            
            <template v-slot:default="{ isActive }">
              <CreateCreature/>
            </template>
          </v-dialog>
        </div>

        <div class="downloadButton button">
          <v-dialog activator="parent" width="auto">
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" icon="mdi-file-download-outline" v-bind="props" @click="downloadButtonClick"></v-btn>
            </template>
            
            <template v-slot:default="{ isActive }">
              <DownloadEncounter/>
            </template>
          </v-dialog>
        </div>

        <div class="clearButton button">
          <v-dialog activator="parent" width="auto">
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" icon="mdi-minus-circle-multiple-outline" v-bind="props"/>
            </template>
            
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-card-text style="margin-top: 10px">
                  Are you sure you want to delete every creature from this encounter?
                </v-card-text>
                <v-card-actions>
                  <v-container>
                    <v-row>
                      <v-col>
                        <v-btn color="error" block variant="elevated" @click="clearButtonClick(); isActive.value = false">Yes, Clear</v-btn>
                      </v-col>
                      <v-col>
                        <v-btn color="info" block variant="tonal" @click="isActive.value = false">No, Go Back</v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useStore } from 'vuex';

  import CreateCreature from '@/components/CreateCreature.vue';
  import DownloadEncounter from '@/components/DownloadEncounter.vue';

  const store = useStore(); // Vuex store

  const showExtra = ref(true); // If the extra options are showing
  let rotated = false; // If the more options button is rotated (due to a click that shows/hides the menu)

  function nextButtonClick() {
    store.commit('nextButtonActivate');
  }

  function optionsButtonClick() {
    showExtra.value = !showExtra.value;

    let button = document.getElementById('rotate');

    if (rotated === false) {
      button.style.transform = 'rotate(-180deg)';
      rotated = true;
    } else {
      button.style.transform = 'rotate(0)';
      rotated = false;
    }
  }

  function downloadButtonClick() {
    store.commit('downloadButtonActivate');
  }

  function clearButtonClick() {
    store.commit('clearButtonActivate');
  }
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-items: flex-end;
  }
  
  .button {
    margin: 10px;
  }

  .nextButton {
    order: 1;
  }

  .extraOptions {
    order: 3;
  }

  .optionsButton {
    order: 2;

    transition: transform 0.5s ease;
  }

  .createButton {
    order: 1;
  }

  .downloadButton {
    order: 2;
  }

  .clearButton {
    order: 3;
  }

  .openOptions-enter-active,
  .openOptions-leave-active {
    transition: all 0.2s ease-in-out;
  }

  .openOptions-enter-from,
  .openOptions-leave-to {
    transform: translate(0, 10vh);
    opacity: 0;
  }

  .openOptions-enter-to,
  .openOptions-leave-from {
    transform: translate(0);
    opacity: 1;
  }
</style>