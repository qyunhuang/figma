<template>
  <div class="content">
    <p>This is a children router.</p>
    <router-link to="/">
      <span>Go Back</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="less" scoped>
.content {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--c-text);
  margin-top: calc(var(--w-space) * 3);
  a {
    color: #42b983;
  }
}
</style>
