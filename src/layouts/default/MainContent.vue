<template>
  <v-app>
    <v-main>
      <MainHeader/>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
  import MainHeader from '@/components/MainHeader.vue';
</script>
