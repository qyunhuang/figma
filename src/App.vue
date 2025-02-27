<template>
  <router-view :key="key" />
</template>

<script setup lang="ts">
const route = useRoute()
const key = computed(() => `${String(route.name || route.path)}-${new Date()}`)
</script>
