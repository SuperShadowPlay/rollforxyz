/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import App from './App.vue';
import { createApp } from 'vue';
import { registerPlugins } from '@/plugins';
import { createStore } from 'vuex';

const app = createApp(App)

// Vuex store
const store = createStore({
  state() {
    return {
      nextCreature: {},
      nextButtonClick: false,
      serializedInitTable: '',
      downloadButtonClick: false,
      newInitTableLoaded: false,
    }
  },
  mutations: {
    newCreature(state, c) {
      state.nextCreature = {
        name: c.name,
        roll: c.roll,
        health: c.health,
        AC: c.AC,
        desc: c.desc
      }
    },
    nextButtonActivate(state) {
      // The next button only needs to change the reactive element to trigger the callback in CreatureBox.vue
      // So it just flips between true and false to keep it simple.
      state.nextButtonClick = !state.nextButtonClick;
    },
    downloadButtonActivate(state) {
      state.downloadButtonClick = !state.downloadButtonClick;
    },
    clearButtonActivate(state) {
      state.clearButtonClick = !state.clearButtonClick;
    },
    uploadInitTableToStore(state, initTableObj) {
      state.serializedInitTable = initTableObj.serialize();
    },
    processNewInitTable(state, serializedInitTable) {
      // When a new initTable is uploaded by the user, put it in the store and then flip a flag
      // that alerts CreatureBox.vue to the change.
      state.serializedInitTable = serializedInitTable;
      state.newInitTableLoaded = !state.newInitTableLoaded;
    },
  },
});
app.use(store)

registerPlugins(app)

app.mount('#app')
