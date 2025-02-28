<template>
  <div class="container">
    <LeftSideBar />
    <CanvasContainer :onMounted="handleCanvasMounted" />
    <RightSideBar />
    <ToolBelt :selectedToolRef="selectedToolRef" :setSelectedToolRef="setSelectedToolRef" />
  </div>
</template>

<script setup lang="ts">
import { fabric } from 'fabric'
import { initializeFabric, handleMouseMoveDown, handleMouseMove, handleMouseMoveUp } from '@/lib/canvas'
import CanvasContainer from '@/components/CanvasContainer.vue'
import { OptionType } from '@/types/type'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const fabricRef = ref<fabric.Canvas | null>(null)
const shapeRef = ref<fabric.Object | null>(null)
const selectedToolRef = ref<OptionType>('rect')
const startPointRef = ref<{ x: number; y: number } | null>(null)

const setSelectedToolRef = (shape: OptionType) => {
  selectedToolRef.value = shape
}

// 定义回调函数，接收子组件的 canvasRef
const handleCanvasMounted = (ref: HTMLCanvasElement | null) => {
  canvasRef.value = ref

  const canvas = initializeFabric({ canvasRef, fabricRef })
  if (!canvas) return

  canvas.on('mouse:down', (options) => {
    handleMouseMoveDown({ options, canvas, shapeRef, selectedShapeRef: selectedToolRef, startPointRef })
  })

  canvas.on('mouse:move', (options) => {
    handleMouseMove({ options, canvas, shapeRef, selectedShapeRef: selectedToolRef, startPointRef })
  })

  canvas.on('mouse:up', () => {
    handleMouseMoveUp(shapeRef)
    if (['rect', 'line', 'ellipse', 'triangle', 'text'].includes(selectedToolRef.value)) {
      selectedToolRef.value = 'move'
    }
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
