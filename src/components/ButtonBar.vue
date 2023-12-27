<template>
  <div class="container">

    <div class="nextButton button">
      <v-btn color="primary" icon="mdi-arrow-down-thick" size="x-large" v-on:click="nextButtonClick"/>
    </div>

    <div class="createButton button">
      <v-dialog activator="parent" width="auto">
        <template v-slot:activator="{ props }">
          <v-btn color="primary" icon="mdi-plus-circle-outline" size="large" v-bind="props"></v-btn>
        </template>
        
        <template v-slot:default="{ isActive }">
          <CreateCreature/>
        </template>
      </v-dialog>
    </div>

    <div class="downloadButton button">
      <v-dialog activator="parent" width="auto">
        <template v-slot:activator="{ props }">
          <v-btn color="primary" icon="mdi-file-download-outline" size="large" v-bind="props" @click="downloadButtonClick"></v-btn>
        </template>
        
        <template v-slot:default="{ isActive }">
          <DownloadEncounter/>
        </template>
      </v-dialog>
    </div>

    <div class="clearButton button">
      <v-dialog activator="parent" width="auto">
        <template v-slot:activator="{ props }">
          <v-btn color="primary" icon="mdi-minus-circle-multiple-outline" size="large" v-bind="props"/>
        </template>
        
        <template v-slot:default="{ isActive }">
          <v-card>
            <v-card-text>
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
</template>

<script setup>
  import { useStore } from 'vuex';

  import CreateCreature from '@/components/CreateCreature.vue';
  import DownloadEncounter from '@/components/DownloadEncounter.vue';

  const store = useStore(); // Vuex store

  function nextButtonClick() {
    store.commit('nextButtonActivate');
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

  .createButton {
    order: 2;
  }

  .downloadButton {
    order: 3;
  }

  .clearButton {
    order: 4;
  }
</style>