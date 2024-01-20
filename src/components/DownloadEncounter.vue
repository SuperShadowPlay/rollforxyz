<template>
  <v-sheet class="mx-5 content">
    <v-textarea class="text" v-model="jsonString"/>

    <v-btn class="uploadButton" v-on:click="uploadButtonClick" color="primary">Upload Encounter</v-btn>
  </v-sheet>
</template>

<script setup>
  import { ref } from 'vue';
  import { useStore } from 'vuex';

  const store = useStore()

  const jsonString = ref(getJSON());

  function getJSON() {
    console.log(store.state.serializedInitTable);
    return store.state.serializedInitTable;
  }

  function uploadButtonClick() {
    store.commit('processNewInitTable', jsonString);
  }
</script>

<style scoped>
.content {
  width: 500px;
  max-width: 90%;
  height: 800px;
  max-height: 90%;

  margin: auto;
  padding: 5px;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

.text {
  height: auto;
  width: auto;

  flex-grow: 2;
}
</style>