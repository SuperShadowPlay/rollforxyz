<template>
  <v-sheet width="500" class="mx-auto">
    <v-form>
      <v-text-field
        v-model="newName"
        single-line
        label="Name"
      >
        <template v-slot:append>
          <v-text-field
            v-model="newRoll"
            single-line
            type="number"
            label="Initiative"
            style="width: 100px"
          ></v-text-field>
        </template>
      </v-text-field>
      <v-btn block class="mt-2" v-on:click="submit">Submit (Not validated yet!)</v-btn>
    </v-form>
  </v-sheet>
</template>

<script setup>
  import {ref} from 'vue';

  const emit = defineEmits(['newCreature']);

  const newName = ref('');
  const newRoll = ref(null);
  
  // TODO: INPUT VALIDATION!!!!! <-----------------------------------------
  function submit() {
    const newCreature = {
    name: newName.value,
    roll: newRoll.value,
  };
    console.log(newCreature);
    emit('newCreature', newCreature);
  }
</script>