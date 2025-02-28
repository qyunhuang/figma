<template>
  <div class="container">
    <LeftSideBar />
    <CanvasContainer :onMounted="handleCanvasMounted" />
    <RightSideBar />
    <ToolBelt />
  </div>
</template>

<script setup lang="ts">
import { fabric } from 'fabric'
import { initializeFabric } from '@/lib/canvas'
import CanvasContainer from '@/components/CanvasContainer.vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const fabricRef = ref<fabric.Canvas | null>(null)

// 定义回调函数，接收子组件的 canvasRef
const handleCanvasMounted = (ref: HTMLCanvasElement | null) => {
  canvasRef.value = ref
  console.log(canvasRef.value)

  const canvas = initializeFabric({ canvasRef, fabricRef })
  console.log(canvas)
}

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
