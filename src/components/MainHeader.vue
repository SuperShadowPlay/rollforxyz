<template>
  <div class="topbar">

    <div class="left">
      <router-link to="/">
        <img class="logo" :src="logoImage" alt="Website Logo"/>
      </router-link>
    </div>


    <div class="right">
      <div class="button">
        <router-link to="/about">
          <v-btn variant="tonal">
            About
          </v-btn>
        </router-link>
      </div>

      <div class="button">
        <router-link to="/">
          <v-btn variant="tonal">
            Home
          </v-btn>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
  import logoImage from "../assets/xyz_full_small_trans.png";
</script>

<style scoped>
  .topbar {
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;

    width: auto;
    max-width: 100%;

    min-height: 50px;
    max-height: 5vh;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }

  .left {
    order: 1;
    flex-shrink: 2;

    max-width: 40%;
  }

  .right {
    order: 2;
    flex-grow: 2;
    align-self: center;
  }

  .button {
    float: right;
    margin-left: 10px;
  }

  .img {
    max-width: auto;
    max-height: auto;
  }

  .logo {
    height: 100%;
  }
</style>