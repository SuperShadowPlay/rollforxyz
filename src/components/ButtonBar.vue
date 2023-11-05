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
</style>