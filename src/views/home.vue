<template>
  <div class="container">
    <LeftSideBar />
    <CanvasContainer :onMounted="handleCanvasMounted" />
    <RightSideBar />
    <ToolBelt :selectedShapeRef="selectedShapeRef" :setSelectedShapeRef="setSelectedShapeRef" />
  </div>
</template>

<script setup lang="ts">
import { fabric } from 'fabric'
import { initializeFabric, handleMouseMoveDown } from '@/lib/canvas'
import CanvasContainer from '@/components/CanvasContainer.vue'
import { selectedShapeRefType } from '@/types/type'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const fabricRef = ref<fabric.Canvas | null>(null)
const shapeRef = ref<fabric.Object | null>(null)
const selectedShapeRef = ref<selectedShapeRefType>('Rectangle')

const setSelectedShapeRef = (shape: selectedShapeRefType) => {
  selectedShapeRef.value = shape
}

// 定义回调函数，接收子组件的 canvasRef
const handleCanvasMounted = (ref: HTMLCanvasElement | null) => {
  canvasRef.value = ref

  const canvas = initializeFabric({ canvasRef, fabricRef })
  if (!canvas) return

  canvas.on('mouse:down', (options) => {
    handleMouseMoveDown({ options, canvas, shapeRef, selectedShapeRef })
  })
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
