<template>
  <div class="topbar">
    <v-row>
      <v-col>
        <div class="left">
          <h1>Roll for
            <img class="logo" :src="logoImage" alt="X Y Z"/>
          </h1>
        </div>
      </v-col>

      <v-col cols="2">
        <div class="right">
          <router-link to="/about">
            <v-btn variant="tonal">
              About
            </v-btn>
          </router-link>
        </div>

        <div class="right">
          <router-link to="/">
            <v-btn variant="tonal">
              Home
            </v-btn>
          </router-link>
        </div>
      </v-col>
    </v-row>
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
  }

  .right {
    float: right;
    margin: 5px;
  }

  .img {
    max-width: auto;
    max-height: 100%;
  }

  .logo {
    height: 50px;
  }
</style>