<template>
  <v-sheet class="mx-5 content" color="background-darken">
    <v-container>
      <v-row>
        <v-textarea v-model="jsonString">
        </v-textarea>
      </v-row>

      <v-row>
        <v-btn v-on:click="uploadButtonClick" color="primary" block>Upload Encounter</v-btn>
      </v-row>
      <v-row><p color="error">Note: This feature is complete and does not work at the moment.</p></v-row>
    </v-container>

  </v-sheet>
</template>

<script setup>
  import { ref } from 'vue';
  import { useStore } from 'vuex';

  const store = useStore()

  const jsonString = ref(getJSON());

  function getJSON() {
    return store.state.serializedInitTable;
  }

  function uploadButtonClick() {
    
  }
</script>

<style scoped>
.content {
  width: 500px;
  max-width: 90%;
  margin: auto;
}
</style>