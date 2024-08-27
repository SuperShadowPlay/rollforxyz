<template>
  <v-sheet color="orange" width="60" height="40" class="menu">
    <v-btn @click="sendHealthChange">Add 10</v-btn>
  </v-sheet>
</template>

<script setup>
  const emit = defineEmits(['healthChange']);

  function sendHealthChange() {
    emit('healthChange', 10);
  }

</script>

<style scoped>
.menu {
  text-align: center;
}
</style>