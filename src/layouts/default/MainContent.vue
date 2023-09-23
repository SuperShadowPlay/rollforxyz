<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <NavBar/>
  </v-app>
</template>

<script setup>
  import NavBar from '@/components/NavBar.vue'
</script>
