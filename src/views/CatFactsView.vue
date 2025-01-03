<script setup lang="ts">
  import CatFacts from "@/components/CatFacts.vue";
</script>

<template>
  <div class="cat-facts">
    <div><h1>Facts about cats 😺</h1></div>
    <div><CatFacts /></div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .cat-facts {
    min-height: 100vh;
    align-items: center;
  }
}
</style>
