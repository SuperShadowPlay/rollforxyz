<template>
  <MainHeader/>
  <div class="content">
    <CreatureBox/>
    <div class="floatingButtons">
      <ButtonBar/>
    </div>
  </div>
</template>

<script setup>
  import MainHeader from '@/components/MainHeader.vue';
  import CreatureBox from '@/components/CreatureBox.vue';
  import ButtonBar from '@/components/ButtonBar.vue';
</script>

<style scoped>
.content {
  position: relative;
}

.floatingButtons {
  margin: 15px;

  position: fixed;
  right: 0;
  bottom: 0;
}
</style>