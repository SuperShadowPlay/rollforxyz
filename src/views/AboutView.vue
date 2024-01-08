<template>
  <div class="content">
    <p>This is the about page. More information to come.</p>

    <div class="button">
      <v-btn variant="tonal" @click="openGitHubPage">
        GitHub
      </v-btn>
    </div>
  </div>
</template>

<script setup>
  function openGitHubPage() {
    window.open('https://github.com/SuperShadowPlay/rollforxyz/', '_blank').focus();
  }
</script>

<style scoped>
.content {
  margin: 15px;
  text-align: center;
}

.button {
  margin: 15px;
}
</style>