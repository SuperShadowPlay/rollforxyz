/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import App from './App.vue'
import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import { createStore } from 'vuex';

const app = createApp(App)

// Vuex store
const store = createStore({
  state() {
    return {
      nextCreature: {},
      nextButtonClick: false,
    }
  },
  mutations: {
    newCreature(state, c) {
      state.nextCreature = {
        name: c.name,
        roll: c.roll,
        desc: c.desc
      }
    },
    nextButtonActivate(state) {
      // The next button only needs to change the reactive element to trigger the callback in CreatureBox.vue
      // So it just flips between true and false to keep it simple.
      state.nextButtonClick = !state.nextButtonClick;
    }
  },
});
app.use(store)

registerPlugins(app)

app.mount('#app')
