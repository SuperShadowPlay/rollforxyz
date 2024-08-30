<template>
  <v-sheet color="info" width="auto" height="auto" class="menu">
    <v-text-field
    type="number"
      variant="outlined"
      v-model="difference"
      :prepend-inner-icon="heartIcon"
    />
    <v-btn @click="sendHealthChange">Go</v-btn>
  </v-sheet>
</template>

<script setup>
  /*
  IDEAS:
  - Remove v-text-field's type and make an plus/minus-icon button that increments the total
  - Add validation using vuetify's included validation parsing
  - Round off corners a bit more?
  - Clean up the submit ("GO") button

  Pretty much done after that tbh. Small changes but I'm running out of time to make them lol.
  */
  import { ref } from 'vue'
  const props = defineProps(['operation']);
  const emit = defineEmits(['healthChange']);

  const difference = ref(0);
  const heartIcon = ref('mdi-heart-plus');

  // Change text field icon to a heart-minus if applicable. Otherwise its heart-plus
  if (props.operation == '-') {
    heartIcon.value = 'mdi-heart-minus';
  }
  

  function getOperationSign() {
    // Returns 1 or -1 based on if the health change is positive or negative
    if (props.operation == '-') {
      return -1;
    } else {
      return 1
    }
  }

  function sendHealthChange() {
    emit('healthChange', difference.value * getOperationSign());
  }

</script>

<style scoped>
.menu {
  text-align: center;
}
</style>