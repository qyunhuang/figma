<template>
  <div class="container">
    <LeftSideBar />
    <CanvasContainer />
    <RightSideBar />
    <ToolBelt />
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="less" scoped>
.container {
  position: relative;
  display: flex;
  max-width: 100vw;
  width: 100vw;
  height: 100vh;
}
</style>
