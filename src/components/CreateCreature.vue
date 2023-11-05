<template>
  <v-sheet class="mx-5 content" color="background-darken">
    <v-form validate-on="submit" ref="form" @submit.prevent>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field
            v-model="newName"
            label="Name"
            :rules="nameRule"
            required/>
          </v-col>
        </v-row>
          
        <v-row>
          <v-col>
            <v-text-field
            v-model="newRoll"
            type="number"
            :rules="rollRule"
            prepend-icon="mdi-dice-d20"
            label="Initiative"/>
          </v-col>  
        
          <v-col>
            <v-text-field
            v-model="newHealth"
            type="number"
            prepend-icon="mdi-heart"
            label="Health"/>
          </v-col>
          
          <v-col>
            <v-text-field
            v-model="newAC"
            type="number"
            prepend-icon="mdi-shield"
            label="AC"/>
          </v-col>
        </v-row>
        <v-btn block class="mt-2" size="x-large" color="primary" type="submit" v-on:click="submit">Submit</v-btn>
      </v-container>

    </v-form>
  </v-sheet>
</template>

<script setup>
  import { ref } from 'vue';
  import { useStore } from 'vuex';

  //const emit = defineEmits(['newCreature']);

  const store = useStore();
  const form = ref();
  const newName = ref(null);
  const newRoll = ref(null);
  const newHealth = ref(null);
  const newAC = ref(null);
  
  async function submit() {
    const { valid } = await form.value.validate()

    if (valid) {
      const newCreature = {
      name: newName.value,
      roll: newRoll.value,
      desc: '',
      health: newHealth.value,
      AC: newAC.value,
    };
    console.log(newCreature)
    store.commit('newCreature', newCreature);
    }
  }

  const nameRule = ref([
    v => {
      if (!v) {
        return 'Name is required';
      }
      return true;
    }
  ]);

  const rollRule = ref([
    v => {
      if (!v) {
        return 'Roll is required';
      }
      return true;
    }
  ]);
</script>

<style scoped>
.content {
  width: 500px;
  max-width: 90%;
  margin: auto;
}
</style>