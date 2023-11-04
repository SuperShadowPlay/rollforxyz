<template>
  <div class="topbar">
    <v-row>
      <v-col>
        <div class="left">
          <h1>Roll for
            <img class="logo" :src="logoImage"/>
          </h1>
        </div>
      </v-col>

      <v-col>
        <div class="right">
          <v-btn variant="tonal" v-on:click="openGitHubPage">
            GitHub
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
  import logoImage from "../assets/xyz_full_small_trans.png";

  function openGitHubPage() {
    window.open('https://github.com/SuperShadowPlay/rollforxyz/', '_blank').focus();
  }
</script>

<style scoped>
  .topbar {
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }
  .right {
    float: right;
  }

  .img {
    max-width: auto;
    max-height: 100%;
  }

  .logo {
    height: 50px;
  }
</style>