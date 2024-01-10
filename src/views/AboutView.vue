<template>
  <div class="content">
    <div class="header">
      <p>
        <b>Roll for XYZ</b> is free online initiative tracker designed with DnD 5e in mind
      </p>
      <br/>
    </div>

    <div class="body">
      <h2>How to create an encounter:</h2>
      <p>
        To get started, press the <v-icon icon="mdi-plus-circle-outline"/> button to add a creature to the initiative.
        Once you are ready to begin, press the <v-icon icon="mdi-arrow-down-thick"/> to begin moving through the initiative.
        The page will scroll to the creature who is currently taking their turn. When you are ready to move to the next, click the
        <v-icon icon="mdi-arrow-down-thick"/> again. The page will scroll in an infinite loop, so even those 10 round encounters will work just fine!
      </p>

      <br/>

      <h2>Source code:</h2>
      <div class="button">
        <v-btn variant="tonal" size="large" @click="openGitHubPage">
          GitHub
        </v-btn>
      </div>
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
}

.header {
  font-size: 1.5em;
  text-align: center;
}

.body {
  margin-right: 15px;
  font-size: 1.1em;
}

.body > p {
  margin-left: 15px;
}

.button {
  margin-top: 5px;
  margin-left: 15px;
}
</style>