<template>
  <div class="canvas-container">
    <canvas id="canvas" ref="canvasRef" class="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null)

const props = defineProps<{
  onMounted: (ref: HTMLCanvasElement | null) => void
}>()

onMounted(() => {
  props.onMounted(canvasRef.value);
})
</script>

<style lang="less" scoped>
.canvas-container {
  width: calc(100% - 250px * 2);
  height: 100%;
  position: relative;
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>